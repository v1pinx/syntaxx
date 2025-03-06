import { NextResponse } from "next/server";
import User from "@/models/user";
import { connect } from "@/app/services/mongodbConnect";
import argon2 from 'argon2';

export async function POST(req: Request) {
  await connect();
  const { token, newPassword } = await req.json();

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 }
    );
  }

  user.password = await argon2.hash(newPassword);
  user.resetToken = null;
  user.resetTokenExpires = null;
  await user.save();

  return NextResponse.json({ message: "Password reset successful" });
}
