import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const body = await req.json();

  console.log(
    "BREVO WEBHOOK:",
    JSON.stringify(body, null, 2)
  );

  return NextResponse.json({
    success: true,
  });
}