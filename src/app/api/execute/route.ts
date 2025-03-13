import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { languageId, encodedCode, stdin } = await request.json();
  if (!languageId || !encodedCode) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  try {
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        language_id: languageId,
        source_code: encodedCode,
        stdin: stdin,
      },
      {
        params: { base64_encoded: "true", wait: false, fields: "*" },
        headers: {
          "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
          "x-rapidapi-host": process.env.X_RAPIDAPI_HOST,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 201) {
      const submissionId = response.data.token;

      // Poll for results with exponential backoff
      let attempts = 0;
      const maxAttempts = 10;

      const getOutput = async () => {
        while (attempts < maxAttempts) {
          attempts++;

          try {
            const outputResponse = await axios.get(
              `https://judge0-ce.p.rapidapi.com/submissions/${submissionId}`,
              {
                params: { base64_encoded: "true", fields: "*" },
                headers: {
                  "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
                  "x-rapidapi-host": process.env.X_RAPIDAPI_HOST,
                },
              }
            );

            const { status, stdout, stderr, compile_output, message } =
              outputResponse.data;

            if (status.id >= 3) {
              const decodedOutput = (output: string) =>
                Buffer.from(output, "base64").toString("utf-8");

              if (stdout) {
                return NextResponse.json({
                  message: "Success",
                  identifier: "stdout",
                  data: decodedOutput(stdout),
                });
              } else if (stderr) {
                return NextResponse.json({
                  message: "Success",
                  identifier: "stderr",
                  data: decodedOutput(stderr),
                });
              } else if (compile_output) {
                return NextResponse.json({
                  message: "Success",
                  identifier: "compile_output",
                  data: decodedOutput(compile_output),
                });
              } else if (message) {
                return NextResponse.json({
                  message: "Success",
                  identifier: "message",
                  data: message,
                });
              } else {
                return NextResponse.json({
                  message: "Success",
                  identifier: "message",
                  data: "No output",
                });
              }
            }
          } catch (error: any) {
            console.error(`Attempt ${attempts}:`, error.message);
          }

          // Exponential backoff with maximum of 2 seconds
          const delay = Math.min(2000, 250 * Math.pow(2, attempts));
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        return NextResponse.json({
          message: "Error",
          data: "Execution timed out",
        });
      };

      return await getOutput();
    }

    // Return error if response status is not 201
    return NextResponse.json({
      message: "Error",
      data: "Failed to submit code",
    });
  } catch (error: any) {
    console.error("Error submitting code:", error);
    return NextResponse.json({
      message: "Error",
      data: error.message,
    });
  }
}
