import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const CATEGORIES = ["uiDesign", "uxFlow", "performance", "functionality", "innovation", "overall"] as const;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const reviews = await prisma.review.findMany({
    where: { appId: id },
  });

  if (reviews.length === 0) {
    return NextResponse.json({
      totalReviews: 0,
      aiReviews: 0,
      humanReviews: 0,
      averageScores: { uiDesign: 0, uxFlow: 0, performance: 0, functionality: 0, innovation: 0, overall: 0 },
      overallAverage: 0,
    });
  }

  const aiReviews = reviews.filter((r) => r.isAI).length;
  const humanReviews = reviews.length - aiReviews;

  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};

  for (const category of CATEGORIES) {
    sums[category] = 0;
    counts[category] = 0;
  }

  for (const review of reviews) {
    const ratings = JSON.parse(review.ratings) as Record<string, number>;
    for (const category of CATEGORIES) {
      if (typeof ratings[category] === "number") {
        sums[category] += ratings[category];
        counts[category]++;
      }
    }
  }

  const averageScores: Record<string, number> = {};
  for (const category of CATEGORIES) {
    averageScores[category] = counts[category] > 0
      ? Math.round((sums[category] / counts[category]) * 10) / 10
      : 0;
  }

  const allValues = Object.values(averageScores);
  const overallAverage = allValues.length > 0
    ? Math.round((allValues.reduce((a, b) => a + b, 0) / allValues.length) * 10) / 10
    : 0;

  return NextResponse.json({
    totalReviews: reviews.length,
    aiReviews,
    humanReviews,
    averageScores,
    overallAverage,
  });
}
