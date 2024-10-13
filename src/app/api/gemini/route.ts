/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

import {
  GoogleGenerativeAI,
} from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const { prompt }  = reqBody;
  const apiKey = process.env.GEMINI_API_KEY;
  if(!apiKey) {
    throw new Error("API key not specified")
  }
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  async function run(prompt: string) {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "you are a friendly chat bot, user we ask you question you have to answer them in a polite manner \n"},
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(prompt);
    // console.log(result.response.text());
    return result.response.text();
  }
  const result = await run(prompt);
  // console.log(result);
  if (!result) {
    return NextResponse.json({
      success: false,
      message: "No response from model",
    });
  }
  return NextResponse.json({
    success: true,
    message: "Response from model",
    response: result,
  });
}