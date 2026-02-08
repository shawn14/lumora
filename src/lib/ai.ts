import OpenAI from "openai";
import { prisma } from "@/lib/db";

export const openai = new OpenAI();

const AI_REVIEWER_ID = "ai-reviewer";
const AI_REVIEWER_EMAIL = "ai-reviewer@lumora.app";

export async function ensureAIReviewer() {
  return prisma.user.upsert({
    where: { id: AI_REVIEWER_ID },
    update: {},
    create: {
      id: AI_REVIEWER_ID,
      name: "AI Reviewer",
      email: AI_REVIEWER_EMAIL,
      role: "admin",
    },
  });
}

interface AppForReview {
  name: string;
  description: string;
  url?: string | null;
  targetAudience?: string | null;
  questions: string;
  screenshots: string;
}

interface AIReviewParsed {
  ratings: Record<string, number>;
  feedback: string;
  suggestions: string[];
}

export async function generateAIReview(app: AppForReview): Promise<AIReviewParsed> {
  const questions = JSON.parse(app.questions) as string[];
  const screenshots = JSON.parse(app.screenshots) as string[];

  const userPrompt = `Please review the following app:

Name: ${app.name}
Description: ${app.description}
${app.url ? `URL: ${app.url}` : ""}
${app.targetAudience ? `Target Audience: ${app.targetAudience}` : ""}
${questions.length > 0 ? `\nSpecific questions from the developer:\n${questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}` : ""}
${screenshots.length > 0 ? `\nScreenshots provided: ${screenshots.length} screenshot(s)` : ""}

Respond with a JSON object (no markdown, just raw JSON) with this exact structure:
{
  "ratings": {
    "uiDesign": <1-10>,
    "uxFlow": <1-10>,
    "performance": <1-10>,
    "functionality": <1-10>,
    "innovation": <1-10>,
    "overall": <1-10>
  },
  "feedback": "<detailed feedback paragraph>",
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert app reviewer with deep experience in UI/UX design, software engineering, and product management. Analyze the app based on the provided information and give honest, constructive feedback. Rate each category from 1-10 where 1 is poor and 10 is exceptional. Provide specific, actionable suggestions. Always respond with valid JSON only.",
      },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content || "{}";
  return JSON.parse(content);
}

export async function createAIReviewRecord(appId: string, parsed: AIReviewParsed) {
  await ensureAIReviewer();

  const ratings = parsed.ratings || {};
  const values = Object.values(ratings).filter((v) => typeof v === "number");
  const overallScore =
    values.length > 0
      ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
      : 0;

  return prisma.review.create({
    data: {
      isAI: true,
      ratings: JSON.stringify(ratings),
      overallScore,
      feedback: parsed.feedback || "AI review generated.",
      suggestions: JSON.stringify(parsed.suggestions || []),
      appId,
      reviewerId: AI_REVIEWER_ID,
    },
  });
}
