import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await connectDB();

  const exists = await User.findOne({
    email: "mrkashif9758@gmail.com",
  });

  if (exists) {
    return NextResponse.json({
      message: "Admin already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(
    "12345678",
    10
  );

  await User.create({
    name: "Admin",
    email: "mrkashif9758@gmail.com",
    password: hashedPassword,
  });

  return NextResponse.json({
    success: true,
  });
}