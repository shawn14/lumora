import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateAIReview, createAIReviewRecord } from "@/lib/ai";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const app = await prisma.app.findUnique({ where: { id } });
  if (!app) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  const existingAIReview = await prisma.review.findFirst({
    where: { appId: id, reviewerId: "ai-reviewer" },
  });
  if (existingAIReview) {
    return NextResponse.json(
      { error: "AI review already exists for this app" },
      { status: 409 }
    );
  }

  let parsed;
  try {
    parsed = await generateAIReview(app);
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
  }

  const review = await createAIReviewRecord(id, parsed);

  return NextResponse.json(
    {
      ...review,
      ratings: JSON.parse(review.ratings),
      suggestions: JSON.parse(review.suggestions),
    },
    { status: 201 }
  );
}
