import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import OpenAI from "openai";
import type { GuideSection, Message } from "@/types";

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  try {
    const { studyId, participantName } = await req.json();

    if (!studyId || !participantName) {
      return NextResponse.json(
        { error: "studyId and participantName are required" },
        { status: 400 }
      );
    }

    const study = await prisma.study.findUnique({
      where: { id: studyId },
      include: { guide: true },
    });

    if (!study) {
      return NextResponse.json({ error: "Study not found" }, { status: 404 });
    }

    const sections: GuideSection[] = study.guide
      ? JSON.parse(study.guide.sections)
      : [];

    const guideText = sections
      .map(
        (s, i) =>
          `Section ${i + 1}: ${s.title}\nObjective: ${s.objective}\nQuestions:\n${s.questions.map((q) => `- ${q}`).join("\n")}`
      )
      .join("\n\n");

    const systemPrompt = `You are a skilled, empathetic user researcher conducting an interview for a study about: "${study.goal}". The participant's name is ${participantName}. Follow the discussion guide but adapt based on responses. Ask follow-up questions when answers are interesting or vague. Be conversational and warm. Keep questions open-ended. Move to the next section when you've covered the current one thoroughly.

Discussion guide sections:
${guideText || "No discussion guide available. Conduct a general exploratory interview about the study goal."}

Start by introducing yourself warmly, explaining the purpose of the interview briefly, and asking the first question from the guide.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }],
      max_tokens: 500,
    });

    const aiContent =
      completion.choices[0]?.message?.content ??
      "Hi! Thank you for joining this interview. Could you start by telling me a bit about yourself?";

    const firstMessage: Message = {
      id: crypto.randomUUID(),
      role: "ai",
      content: aiContent,
      timestamp: new Date(),
    };

    const interview = await prisma.interview.create({
      data: {
        studyId,
        participantName,
        status: "in_progress",
        messages: JSON.stringify([firstMessage]),
        startedAt: new Date(),
      },
    });

    return NextResponse.json({
      ...interview,
      messages: [firstMessage],
    });
  } catch (error) {
    console.error("Failed to create interview:", error);
    return NextResponse.json(
      { error: "Failed to create interview" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const studyId = req.nextUrl.searchParams.get("studyId");

    if (!studyId) {
      return NextResponse.json(
        { error: "studyId is required" },
        { status: 400 }
      );
    }

    const interviews = await prisma.interview.findMany({
      where: { studyId },
      orderBy: { createdAt: "desc" },
    });

    const parsed = interviews.map((interview) => ({
      ...interview,
      messages: JSON.parse(interview.messages),
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Failed to fetch interviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch interviews" },
      { status: 500 }
    );
  }
}
