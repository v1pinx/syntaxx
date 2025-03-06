import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { isValid: false, error: "Token missing" },
        { status: 400 }
      );
    }

    const isValid = verifyToken(token);

    return NextResponse.json({ isValid: !!isValid, decoded: isValid });
  } catch {
    return NextResponse.json(
      { isValid: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
