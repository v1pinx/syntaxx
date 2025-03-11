import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import {connect} from "@/app/services/mongodbConnect";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(`${request.nextUrl.origin}/login?error=oauth_failed`);
    }

    try {
        const { data } = await axios.post(
            "https://oauth2.googleapis.com/token",
            new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                code,
                grant_type: "authorization_code",
                redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`,
            })
        );

        const { data: userInfo } = await axios.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            { headers: { Authorization: `Bearer ${data.access_token}` } }
        );

        await connect();
        let user = await User.findOne({ email: userInfo.email });

        if (!user) {
            user = await User.create({
                username: userInfo.name,
                email: userInfo.email,
                provider: "google",
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
            expiresIn: "1h",
        });

        const response = NextResponse.redirect(`${request.nextUrl.origin}/`);
        response.cookies.set("token", token, {
            httpOnly: false,
            path: "/",
            maxAge: 3600,
        });

        return response;
    } catch (error) {
        console.error("OAuth Error:", error);
        return NextResponse.redirect(`${request.nextUrl.origin}/login?error=oauth_failed`);
    }
}
