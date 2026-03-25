import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage } from "langchain";
import "dotenv/config";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export const generateChatTitle = async (message) => {
  const response = await mistralModel.invoke([
    new SystemMessage(`
      You are a helpful assistant that generates titles for chat conversations.
      Generate a concise and descriptive title for the chat messages, where title should be between 3 to 4 words
      and the title should give the idea of what the chat is about and title should be generated based on the first message of the chat.
      `),
    new HumanMessage(`
          Generate a title for the chat conversation based on the user's first chat message:
          ${message}
        `),
  ]);
  return response.text;
};

export const generateResponse = async (messages) => {
  const response = await geminiModel.invoke(
    messages.map((message) => {
      if (message.role === "user") return new HumanMessage(message.content);
      else if (message.role === "ai") return new AIMessage(message.content);
    }),
  );
  return response.text;
};
