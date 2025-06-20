import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { topic, conversationText } = await req.json();
    if (!topic && !conversationText) {
      return NextResponse.json({ error: "Topic or conversationText is required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Compose the prompt
    const prompt = `Generate 3 multiple-choice questions (MCQs) with 4 options each and the correct answer, based on the following topic or conversation. Format the output as a JSON array with objects containing 'question', 'options' (array), and 'answer' (string):\n\n${topic ? `Topic: ${topic}` : `Conversation: ${conversationText}`}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the response as JSON
    let mcqs;
    try {
      mcqs = JSON.parse(text);
    } catch (e) {
      // If not valid JSON, try to extract JSON from the text
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        mcqs = JSON.parse(match[0]);
      } else {
        return NextResponse.json({ error: "Failed to parse MCQ response from Gemini", raw: text }, { status: 500 });
      }
    }

    return NextResponse.json({ mcqs });
  } catch (error) {
    console.error("Error generating MCQs:", error);
    return NextResponse.json({ error: "Failed to generate MCQs" }, { status: 500 });
  }
} 