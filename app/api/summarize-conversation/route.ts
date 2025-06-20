import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { conversationText } = await req.json();

    if (!conversationText) {
      return NextResponse.json({ error: "Conversation text is required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // --- Parsing and Selective Summarization Logic ---
    const lines: string[] = conversationText.split('\n').filter((line: string) => line.trim() !== '');
    let finalConversationParts: string[] = [];
    let currentSpeaker = '';
    let currentMessageBuffer = '';

    const turns: { speaker: string; message: string }[] = [];
    for (const line of lines) {
      if (line.startsWith('CLIENT:')) {
        if (currentMessageBuffer && currentSpeaker) {
          turns.push({ speaker: currentSpeaker, message: currentMessageBuffer.trim() });
        }
        currentSpeaker = 'CLIENT';
        currentMessageBuffer = line.substring('CLIENT:'.length).trim();
      } else if (line.startsWith('AVATAR:')) {
        if (currentMessageBuffer && currentSpeaker) {
          turns.push({ speaker: currentSpeaker, message: currentMessageBuffer.trim() });
        }
        currentSpeaker = 'AVATAR';
        currentMessageBuffer = line.substring('AVATAR:'.length).trim();
      } else {
        currentMessageBuffer += '\n' + line.trim();
      }
    }
    if (currentMessageBuffer && currentSpeaker) {
      turns.push({ speaker: currentSpeaker, message: currentMessageBuffer.trim() });
    }

    for (const turn of turns) {
      if (turn.speaker === 'CLIENT') {
        finalConversationParts.push(`**You:** ${turn.message}`);
      } else if (turn.speaker === 'AVATAR') {
        if (turn.message.trim() === '') {
             finalConversationParts.push('**AVATAR (Summarized):** ');
             continue;
        }

        // --- REVISED PROMPT FOR "NOTES" STYLE SUMMARY ---
        const notesSummaryPrompt = `
          You are a concise note-taker for a learning session. Your task is to extract and summarize only the essential information, concepts, definitions, and key points provided by the AI assistant.
          Present this information directly as clear, factual notes.
          Do NOT include conversational filler, descriptions of the assistant's actions (e.g., "The assistant explained," "The assistant proposed"), or acknowledgements.
          Aim for brevity and directness, as if creating flashcards or study points. Use bullet points or short, descriptive sentences.

          Example 1:
          Assistant message: "Machine learning is a field of artificial intelligence that enables systems to learn from data without being explicitly programmed."
          Summary: "Machine Learning (ML): Field of AI where systems learn from data without explicit programming."

          Example 2:
          Assistant message: "The main types of ML are supervised, unsupervised, and reinforcement learning."
          Summary: "ML Types: Supervised, Unsupervised, Reinforcement Learning."

          Example 3:
          Assistant message: "We can cover basic concepts, algorithms, data preparation, and model evaluation. Which would you like to start with?"
          Summary: "Learning path options: Basic concepts, Algorithms, Data preparation, Model evaluation."

          Summarize the following message for learning notes:
          ${turn.message}
        `;
        // --- END REVISED PROMPT ---

        const result = await model.generateContent(notesSummaryPrompt);
        const response = await result.response;
        const summarizedAvatarMessage = response.text();
        finalConversationParts.push(`**AVATAR (Summarized):** ${summarizedAvatarMessage}`);
      }
    }

    const finalFormattedOutput = finalConversationParts.join('\n\n');

    return NextResponse.json({ summary: finalFormattedOutput.trim() });
  } catch (error) {
    console.error("Error summarizing conversation:", error);
    return NextResponse.json({ error: "Failed to summarize conversation" }, { status: 500 });
  }
}