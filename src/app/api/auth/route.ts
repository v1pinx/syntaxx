import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { connect } from "@/app/services/mongodbConnect";
import argon2 from "argon2";
import { generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { type, username, email, password } = await request.json();

    if (!type || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (type === "signup") {
      if (!username) {
        return NextResponse.json({ message: "Username is required" }, { status: 400 });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ message: "Email already exists" }, { status: 400 });
      }

      const hashedPassword = await argon2.hash(password);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } 
    
    if (type === "login") {
      const user = await User.findOne({ email });

      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
        return NextResponse.json({ message: "Invalid password" }, { status: 401 });
      }

      const token = generateToken(user._id.toString());

      return NextResponse.json({ message: "Login successful", token }, { status: 200 });
    }

    return NextResponse.json({ message: "Invalid request type" }, { status: 400 });

  } catch (error) {
    console.error("Error logging in222", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
