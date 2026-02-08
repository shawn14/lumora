import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, reviewId } = await params;
  const body = await req.json();

  if (typeof body.helpful !== "boolean") {
    return NextResponse.json(
      { error: "helpful must be a boolean" },
      { status: 400 }
    );
  }

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review || review.appId !== id) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  // Don't allow voting on your own review
  if (review.reviewerId === session.user.id) {
    return NextResponse.json(
      { error: "Cannot vote on your own review" },
      { status: 403 }
    );
  }

  const vote = await prisma.reviewVote.upsert({
    where: {
      reviewId_voterId: {
        reviewId,
        voterId: session.user.id,
      },
    },
    update: { helpful: body.helpful },
    create: {
      reviewId,
      voterId: session.user.id,
      helpful: body.helpful,
    },
  });

  return NextResponse.json({ vote });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
  const { id, reviewId } = await params;

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review || review.appId !== id) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const votes = await prisma.reviewVote.findMany({ where: { reviewId } });
  const helpful = votes.filter((v) => v.helpful).length;
  const unhelpful = votes.filter((v) => !v.helpful).length;

  return NextResponse.json({ helpful, unhelpful });
}
