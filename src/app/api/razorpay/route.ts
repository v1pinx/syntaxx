import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/services/mongodbConnect";
import User from "@/models/user";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount } = body;

    if (!amount || typeof amount !== "number") {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("Razorpay order created:", order);
    await connect();
    const { id } = body;
    if (id) {
      const user = await User.findById(id);
      if (user) {
        user.isPro = true;
        user.updatedAt = new Date();
        await user.save();
      } else {
        console.error("User not found with ID:", id);
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay error:", error);
    return NextResponse.json(
      { message: "Failed to create Razorpay order", error: error.message },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json(
    { message: "GET not supported for this route" },
    { status: 405 }
  );
}
