// pages/api/generate-questions.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { StreamingTextResponse, streamText } from "ai";
import { NextResponse } from "next/server";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

export const maxDuration = 30;

export async function POST(req: NextApiRequest) {
  try {
    const { prompt } = req.body;
    const formattedPrompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be based on the input that user provide: ${prompt}.`;

    const result = await streamText({
      model: google("models/gemini-pro"),
      prompt: formattedPrompt,
    }); // Convert stream to text
    console.log(result);
    return new StreamingTextResponse(result.toAIStream());
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json({ error: "Failed to generate questions" });
  }
}
