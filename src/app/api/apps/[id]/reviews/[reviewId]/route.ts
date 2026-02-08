import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, reviewId } = await params;

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
  if (review.appId !== id) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
  if (review.reviewerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.review.delete({ where: { id: reviewId } });

  return NextResponse.json({ message: "Review deleted" });
}
