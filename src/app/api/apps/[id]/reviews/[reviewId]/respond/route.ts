import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, reviewId } = await params;
  const body = await req.json();

  if (!body.response || typeof body.response !== "string" || body.response.trim() === "") {
    return NextResponse.json(
      { error: "Response text is required" },
      { status: 400 }
    );
  }

  // Verify the app exists and the user owns it
  const app = await prisma.app.findUnique({ where: { id } });
  if (!app) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }
  if (app.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Only the app owner can respond to reviews" },
      { status: 403 }
    );
  }

  // Verify the review exists and belongs to this app
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review || review.appId !== id) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: {
      ownerResponse: body.response.trim(),
      ownerRespondedAt: new Date(),
    },
  });

  return NextResponse.json({
    ownerResponse: updated.ownerResponse,
    ownerRespondedAt: updated.ownerRespondedAt,
  });
}
