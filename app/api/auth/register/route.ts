import { connectToDatabase } from "@/helpers/serverHelpers";
import prisma from "@/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Invalid data" }, { status: 422 });
    }

    await connectToDatabase();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({ data: { email, name, hashedPassword } });

    const user = { name, email };

    return NextResponse.json({ user, message: "User created" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
