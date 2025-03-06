import { NextResponse } from "next/server";
import User from "@/models/user";
import { connect } from "@/app/services/mongodbConnect";
import crypto from 'crypto';
import sendEmail from "@/utils/sendEmail";

export async function POST(request: Request){
    await connect();

    const {email} = await request.json();

    const user = await User.findOne({ email });
    if(!user){
        return NextResponse.json({message: "User not found"}, {status: 404});
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 600000);
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

    await sendEmail(email, "Password Reset", `Click here to reset your password: ${resetUrl}`);
    
    return NextResponse.json({ message: "Password reset email sent" });

}