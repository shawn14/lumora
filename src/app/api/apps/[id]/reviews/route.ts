import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
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

  const existing = await prisma.review.findFirst({
    where: { appId: id, reviewerId: session.user.id },
  });
  if (existing) {
    return NextResponse.json({ error: "You have already reviewed this app" }, { status: 409 });
  }

  const body = await req.json();
  const { ratings, feedback, suggestions } = body;

  if (!ratings || !feedback) {
    return NextResponse.json({ error: "Ratings and feedback are required" }, { status: 400 });
  }

  const values = Object.values(ratings as Record<string, number>).filter(
    (v) => typeof v === "number"
  );
  const overallScore = values.length > 0
    ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
    : 0;

  const review = await prisma.review.create({
    data: {
      isAI: false,
      ratings: JSON.stringify(ratings),
      overallScore,
      feedback,
      suggestions: JSON.stringify(suggestions || []),
      appId: id,
      reviewerId: session.user.id,
    },
  });

  return NextResponse.json({
    ...review,
    ratings: JSON.parse(review.ratings),
    suggestions: JSON.parse(review.suggestions),
  }, { status: 201 });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const reviews = await prisma.review.findMany({
    where: { appId: id },
    include: {
      reviewer: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    reviews.map((r) => ({
      ...r,
      ratings: JSON.parse(r.ratings),
      suggestions: JSON.parse(r.suggestions),
    }))
  );
}
