import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI("AIzaSyCLzWWQOLDUcUAAn4ZAxbwaSG5Srp5DsDU");

const SYSTEM_PROMPT = `You are AngelicaBot, a cheerful AI assistant celebrating Angelica's birthday. 
Your responses should be warm, friendly, and celebratory. You love emojis and spreading joy.
You should respond as if you are Angelica's personal birthday celebration assistant.
Keep responses concise and fun, around 1-2 sentences.`;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: SYSTEM_PROMPT,
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    return NextResponse.json({
      message: response.text(),
    });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
