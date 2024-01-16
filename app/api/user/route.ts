import { connectToDatabase } from "@/helpers/serverHelpers";
import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const users = await prisma.user.findMany();

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
