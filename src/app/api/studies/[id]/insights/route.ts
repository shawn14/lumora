import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: studyId } = await params;

  const insight = await prisma.insight.findFirst({
    where: { studyId },
    orderBy: { generatedAt: "desc" },
  });

  if (!insight) {
    return NextResponse.json(null, { status: 404 });
  }

  return NextResponse.json({
    ...insight,
    themes: JSON.parse(insight.themes),
    recommendations: JSON.parse(insight.recommendations),
  });
}
