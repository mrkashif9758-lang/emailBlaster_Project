import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = process.env.TEMP_ADMIN_EMAIL ?? "admin@emailblaster.local";
const ADMIN_PASSWORD = process.env.TEMP_ADMIN_PASSWORD ?? "Admin@12345";
const ADMIN_NAME = process.env.TEMP_ADMIN_NAME ?? "Admin";

/**
 * Development-only bootstrap endpoint. Visit /create-admin once, then sign in
 * at /login using TEMP_ADMIN_EMAIL and TEMP_ADMIN_PASSWORD (or the defaults).
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({
        success: true,
        created: false,
        message: "Admin already exists. You can sign in now.",
        email: ADMIN_EMAIL,
      });
    }

    const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password });

    return NextResponse.json({
      success: true,
      created: true,
      message: "Temporary admin created. You can sign in now.",
      email: ADMIN_EMAIL,
    });
  } catch (error) {
    console.error("Failed to create temporary admin:", error);
    return NextResponse.json(
      { error: "Unable to create the temporary admin" },
      { status: 500 }
    );
  }
}
