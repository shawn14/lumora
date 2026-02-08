import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI();

const typeLabels: Record<string, string> = {
  exploratory: "Exploratory Research",
  concept_test: "Concept Testing",
  usability_test: "Usability Testing",
  journey_map: "Customer Journey Mapping",
};

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const study = await prisma.study.findUnique({ where: { id } });
  if (!study) {
    return NextResponse.json({ error: "Study not found" }, { status: 404 });
  }

  const systemPrompt = `You are an expert user researcher. Generate a structured discussion guide for a customer research study.

Return ONLY a JSON array of sections (no markdown, no code fences, no additional text). Each section should have:
- "title": string (section name)
- "objective": string (what this section aims to uncover)
- "questions": string[] (3-5 open-ended questions)

Generate 4-5 sections that progressively dive deeper into the research goal. Start with warm-up/context questions and end with forward-looking or wrap-up questions.`;

  const userPrompt = `Study Name: ${study.name}
Research Goal: ${study.goal}
Target Audience: ${study.targetAudience}
Study Type: ${typeLabels[study.type] ?? study.type}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
  });

  const raw = completion.choices[0]?.message?.content ?? "[]";

  let sections;
  try {
    // Strip potential markdown code fences
    const cleaned = raw.replace(/```json?\n?/g, "").replace(/```\n?/g, "").trim();
    sections = JSON.parse(cleaned);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse AI response" },
      { status: 500 }
    );
  }

  const guide = await prisma.discussionGuide.upsert({
    where: { studyId: id },
    update: { sections: JSON.stringify(sections) },
    create: { studyId: id, sections: JSON.stringify(sections) },
  });

  return NextResponse.json({
    id: guide.id,
    sections,
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const guide = await prisma.discussionGuide.findUnique({
    where: { studyId: id },
  });

  if (!guide) {
    return NextResponse.json({ error: "Guide not found" }, { status: 404 });
  }

  const updated = await prisma.discussionGuide.update({
    where: { studyId: id },
    data: { sections: JSON.stringify(body.sections) },
  });

  return NextResponse.json({
    id: updated.id,
    sections: JSON.parse(updated.sections),
  });
}
