import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const app = await prisma.app.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      reviews: { select: { overallScore: true, isAI: true } },
    },
  });

  if (!app) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  const reviewCount = app.reviews.length;
  const averageScore = reviewCount > 0
    ? app.reviews.reduce((sum, r) => sum + r.overallScore, 0) / reviewCount
    : 0;

  return NextResponse.json({
    ...app,
    questions: JSON.parse(app.questions),
    screenshots: JSON.parse(app.screenshots),
    reviews: undefined,
    reviewCount,
    averageScore: Math.round(averageScore * 10) / 10,
    aiReviewCount: app.reviews.filter((r) => r.isAI).length,
    humanReviewCount: app.reviews.filter((r) => !r.isAI).length,
  });
}

export async function PUT(
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
  if (app.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const updated = await prisma.app.update({
    where: { id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.description && { description: body.description }),
      ...(body.url !== undefined && { url: body.url }),
      ...(body.targetAudience !== undefined && { targetAudience: body.targetAudience }),
      ...(body.questions && { questions: JSON.stringify(body.questions) }),
      ...(body.screenshots && { screenshots: JSON.stringify(body.screenshots) }),
      ...(body.status && { status: body.status }),
    },
  });

  return NextResponse.json({
    ...updated,
    questions: JSON.parse(updated.questions),
    screenshots: JSON.parse(updated.screenshots),
  });
}
