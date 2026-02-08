import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import OpenAI from "openai";
import type { GuideSection, Message } from "@/types";

const openai = new OpenAI();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ interviewId: string }> }
) {
  try {
    const { interviewId } = await params;
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 }
      );
    }

    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: { study: { include: { guide: true } } },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    if (interview.status === "completed") {
      return NextResponse.json(
        { error: "Interview has already ended" },
        { status: 400 }
      );
    }

    const existingMessages: Message[] = JSON.parse(interview.messages);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "participant",
      content: message,
      timestamp: new Date(),
    };

    existingMessages.push(userMessage);

    const sections: GuideSection[] = interview.study.guide
      ? JSON.parse(interview.study.guide.sections)
      : [];

    const guideText = sections
      .map(
        (s, i) =>
          `Section ${i + 1}: ${s.title}\nObjective: ${s.objective}\nQuestions:\n${s.questions.map((q) => `- ${q}`).join("\n")}`
      )
      .join("\n\n");

    const systemPrompt = `You are a skilled, empathetic user researcher conducting an interview. Follow the discussion guide but adapt based on responses. Ask follow-up questions when answers are interesting or vague. Be conversational and warm. Keep questions open-ended. Move to the next section when you've covered the current one thoroughly. The participant's name is ${interview.participantName}.

The study goal is: "${interview.study.goal}"

Discussion guide sections:
${guideText || "No discussion guide available. Conduct a general exploratory interview about the study goal."}`;

    const conversationHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [
        { role: "system", content: systemPrompt },
        ...existingMessages.map(
          (m) =>
            ({
              role: m.role === "ai" ? "assistant" : "user",
              content: m.content,
            }) as OpenAI.Chat.Completions.ChatCompletionMessageParam
        ),
      ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: conversationHistory,
      max_tokens: 500,
    });

    const aiContent =
      completion.choices[0]?.message?.content ??
      "Could you tell me more about that?";

    const aiMessage: Message = {
      id: crypto.randomUUID(),
      role: "ai",
      content: aiContent,
      timestamp: new Date(),
    };

    existingMessages.push(aiMessage);

    await prisma.interview.update({
      where: { id: interviewId },
      data: { messages: JSON.stringify(existingMessages) },
    });

    return NextResponse.json({
      userMessage,
      aiMessage,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
