import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const study = await prisma.study.findUnique({
    where: { id },
    include: {
      guide: true,
      _count: {
        select: { interviews: true, insights: true },
      },
    },
  });

  if (!study) {
    return NextResponse.json({ error: "Study not found" }, { status: 404 });
  }

  const { guide, _count, ...studyData } = study;

  return NextResponse.json({
    study: studyData,
    guide: guide
      ? { id: guide.id, sections: JSON.parse(guide.sections) }
      : null,
    interviewCount: _count.interviews,
    insightCount: _count.insights,
  });
}
