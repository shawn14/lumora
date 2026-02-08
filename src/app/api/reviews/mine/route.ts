import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviews = await prisma.review.findMany({
    where: { reviewerId: session.user.id },
    include: {
      app: { select: { name: true, id: true } },
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
