import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

const HARDCODED_USER_ID = "demo-user";

async function getUserId() {
  try {
    const session = await auth();
    return session?.user?.id ?? HARDCODED_USER_ID;
  } catch {
    return HARDCODED_USER_ID;
  }
}

export async function GET() {
  const userId = await getUserId();

  const studies = await prisma.study.findMany({
    where: { userId },
    include: {
      _count: {
        select: { interviews: true, insights: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(studies);
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  const body = await req.json();

  const { name, goal, targetAudience, type } = body;

  if (!name || !goal || !targetAudience || !type) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const validTypes = [
    "exploratory",
    "concept_test",
    "usability_test",
    "journey_map",
  ];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid study type" }, { status: 400 });
  }

  // Ensure the user exists (for demo/hardcoded user)
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: `${userId}@lumora.app`,
      name: "Demo User",
    },
  });

  const study = await prisma.study.create({
    data: {
      name,
      goal,
      targetAudience,
      type,
      userId,
    },
  });

  return NextResponse.json(study, { status: 201 });
}
