import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    );
  }

  if (email !== session.user.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 409 }
      );
    }
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name, email },
  });

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
}
