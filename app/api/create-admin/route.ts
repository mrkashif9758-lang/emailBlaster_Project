// app/api/create-admin/route.ts

import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await connectDB();

  const existingUser = await User.findOne({
    email: "mrkashif9758@gmail.com",
  });

  if (existingUser) {
    return NextResponse.json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(
    "12345678",
    10
  );

  await User.create({
    name: "Kashif",
    email: "mrkashif9758@gmail.com",
    password: hashedPassword,
  });

  return NextResponse.json({
    success: true,
    message: "Admin created",
  });
}