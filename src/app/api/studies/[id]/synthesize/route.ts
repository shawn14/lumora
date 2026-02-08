import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import OpenAI from "openai";
import type { Message } from "@/types";

const openai = new OpenAI();

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studyId } = await params;

    const study = await prisma.study.findUnique({
      where: { id: studyId },
      include: { interviews: true },
    });

    if (!study) {
      return NextResponse.json({ error: "Study not found" }, { status: 404 });
    }

    const completedInterviews = study.interviews.filter(
      (i) => i.status === "completed"
    );

    if (completedInterviews.length === 0) {
      return NextResponse.json(
        { error: "No completed interviews to synthesize" },
        { status: 400 }
      );
    }

    const transcripts = completedInterviews
      .map((interview) => {
        const messages: Message[] = JSON.parse(interview.messages);
        const transcript = messages
          .map(
            (m) =>
              `${m.role === "ai" ? "Interviewer" : interview.participantName}: ${m.content}`
          )
          .join("\n");
        return `--- Interview with ${interview.participantName} ---\n${transcript}`;
      })
      .join("\n\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert research analyst. Analyze the following interview transcripts from a customer research study about: "${study.goal}".

Identify key themes, sentiment patterns, and actionable recommendations.

Return ONLY valid JSON (no markdown, no code fences) with this exact structure:
{
  "summary": "2-3 paragraph executive summary",
  "themes": [
    {
      "name": "Theme name",
      "description": "Theme description",
      "sentiment": "positive|negative|neutral|mixed",
      "quotes": ["exact quote 1", "exact quote 2"],
      "frequency": 1-10
    }
  ],
  "recommendations": ["recommendation 1", "recommendation 2", "...5-8 total"]
}`,
        },
        {
          role: "user",
          content: `Here are the interview transcripts:\n\n${transcripts}`,
        },
      ],
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    const insight = await prisma.insight.create({
      data: {
        studyId,
        summary: parsed.summary ?? "",
        themes: JSON.stringify(parsed.themes ?? []),
        recommendations: JSON.stringify(parsed.recommendations ?? []),
      },
    });

    return NextResponse.json({
      ...insight,
      themes: parsed.themes ?? [],
      recommendations: parsed.recommendations ?? [],
    });
  } catch (error) {
    console.error("Synthesis error:", error);
    return NextResponse.json(
      { error: "Failed to synthesize insights" },
      { status: 500 }
    );
  }
}
