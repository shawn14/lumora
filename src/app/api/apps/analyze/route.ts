import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { openai, generateAIReview, createAIReviewRecord } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { url } = body;

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  // Fetch URL HTML
  let html: string;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; LumoraBot/1.0; +https://lumora.app)",
      },
    });
    clearTimeout(timeout);
    html = await res.text();
  } catch {
    return NextResponse.json(
      { error: "Could not access that URL. Make sure it's publicly accessible." },
      { status: 422 }
    );
  }

  // Extract metadata from HTML
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || "";
  const metaDesc =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1]?.trim() ||
    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)?.[1]?.trim() ||
    "";
  const ogTitle =
    html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i)?.[1]?.trim() ||
    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:title["']/i)?.[1]?.trim() ||
    "";
  const ogDesc =
    html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i)?.[1]?.trim() ||
    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:description["']/i)?.[1]?.trim() ||
    "";
  const ogImage =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i)?.[1]?.trim() ||
    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:image["']/i)?.[1]?.trim() ||
    "";

  // Strip scripts/styles and extract body text
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let bodyText = bodyMatch?.[1] || html;
  bodyText = bodyText
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4000);

  // AI PM analysis
  const siteContext = `URL: ${url}
Page Title: ${ogTitle || title}
Meta Description: ${ogDesc || metaDesc}
${ogImage ? `OG Image: ${ogImage}` : ""}

Page Content (truncated):
${bodyText}`;

  let aiAnalysis: {
    name: string;
    description: string;
    targetAudience: string;
    questions: string[];
  };

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert AI Product Manager. Given a webpage's content, extract and generate app metadata for a review platform. Respond with valid JSON only (no markdown).

{
  "name": "<concise app name, max 60 chars>",
  "description": "<2-3 sentence description of what the app does and its value proposition>",
  "targetAudience": "<who this app is for, 1 sentence>",
  "questions": ["<smart review question 1>", "<smart review question 2>", "<smart review question 3>"]
}

For questions, generate 3 thoughtful questions that a product reviewer should evaluate, specific to this app. Focus on UX, value prop, and differentiation.`,
        },
        { role: "user", content: siteContext },
      ],
      temperature: 0.5,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    aiAnalysis = JSON.parse(content);
  } catch (err) {
    console.error("AI PM analysis failed:", err);
    return NextResponse.json(
      { error: "AI analysis failed. Please try again." },
      { status: 500 }
    );
  }

  // Create App record
  const screenshots = ogImage ? [ogImage] : [];

  const app = await prisma.app.create({
    data: {
      name: aiAnalysis.name || title || parsedUrl.hostname,
      description: aiAnalysis.description || metaDesc || "No description available.",
      url,
      targetAudience: aiAnalysis.targetAudience || null,
      questions: JSON.stringify(aiAnalysis.questions || []),
      screenshots: JSON.stringify(screenshots),
      userId: session.user.id,
    },
  });

  // Generate AI review (best-effort — still return appId if this fails)
  try {
    const parsed = await generateAIReview(app);
    await createAIReviewRecord(app.id, parsed);
  } catch (err) {
    console.error("AI review generation failed after app creation:", err);
  }

  return NextResponse.json({ appId: app.id }, { status: 201 });
}
