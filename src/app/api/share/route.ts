import { NextRequest, NextResponse } from "next/server";
import Gist from "@/models/gist";
import { connect } from "@/app/services/mongodbConnect";

export async function POST(request: NextRequest) {
  const { username, language, code } = await request.json();

  if (!username || !language || !code) {
    return new Response("Invalid request", { status: 400 });
  }

  try {
    await connect();
    const gist = new Gist({ username, language, code });
    await gist.save();
    return NextResponse.json(
      { message: "Gist saved successfully", data: gist },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  try {
    await connect();

    const gist = await Gist.findById({ _id: id });
    if (!gist) {
      return NextResponse.json({ message: "Gist not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Gist found", data: gist },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
