import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, url, targetAudience, questions, screenshots } = body;

  if (!name || !description) {
    return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
  }

  const app = await prisma.app.create({
    data: {
      name,
      description,
      url: url || null,
      targetAudience: targetAudience || null,
      questions: JSON.stringify(questions || []),
      screenshots: JSON.stringify(screenshots || []),
      userId: session.user.id,
    },
  });

  return NextResponse.json({
    ...app,
    questions: JSON.parse(app.questions),
    screenshots: JSON.parse(app.screenshots),
  }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mine = req.nextUrl.searchParams.get("mine");

  const where = mine === "true" ? { userId: session.user.id } : { status: "published" };

  const apps = await prisma.app.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      reviews: { select: { overallScore: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const result = apps.map((app) => {
    const reviewCount = app.reviews.length;
    const averageScore = reviewCount > 0
      ? app.reviews.reduce((sum, r) => sum + r.overallScore, 0) / reviewCount
      : 0;
    return {
      ...app,
      questions: JSON.parse(app.questions),
      screenshots: JSON.parse(app.screenshots),
      reviews: undefined,
      reviewCount,
      averageScore: Math.round(averageScore * 10) / 10,
    };
  });

  return NextResponse.json(result);
}
