import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback&response_type=code&scope=email profile`;

    return NextResponse.redirect(googleAuthURL);
}
