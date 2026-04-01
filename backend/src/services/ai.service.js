import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  tool,
  createAgent,
} from "langchain";
import "dotenv/config";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";
import { emitToSocket } from "../sockets/server.socket.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const searchInternetTool = tool(
  async ({ query }) => {
    return await searchInternet(query);
  },
  {
    name: "searchInternet",
    description:
      "Use this tool to search the internet to get relevant and latest information to answer the user's queries.",
    schema: z.object({
      query: z.string().describe("The search query to lookup on the internet."),
    }),
  }
);

const agent = createAgent({
  model: geminiModel,
  tools: [searchInternetTool],
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

export const generateResponse = async (messages, { socketId = null, chatId = null } = {}) => {
  const formattedMessages = messages.map((message) => {
    if (message.role === "user") return new HumanMessage(message.content);
    else if (message.role === "ai") return new AIMessage(message.content);
  });

  if (!socketId) {
    const response = await agent.invoke({
      messages: formattedMessages,
    });
    return response.messages[response.messages.length - 1].text;
  }

  emitToSocket(socketId, "typing", { isTyping: true, chatId });

  const eventStream = await agent.streamEvents(
    { messages: formattedMessages },
    { version: "v2" }
  );

  let fullContent = "";
  let toolInProgress = false;
  let toolEverCalled = false;
  let isInFinalAnswer = false;

  for await (const event of eventStream) {
    if (event.event === "on_tool_start") {
      toolInProgress = true;
      toolEverCalled = true;
      isInFinalAnswer = false;
    }

    if (event.event === "on_tool_end") {
      toolInProgress = false;
      isInFinalAnswer = true;
    }

    if (event.event === "on_chat_model_stream") {
      // Stream only if: no tools were ever called (direct answer)
      // OR we are in the final answer phase (after the last tool finished)
      const shouldStream = !toolEverCalled || isInFinalAnswer;

      if (shouldStream) {
        const chunk = event.data?.chunk?.content;
        if (chunk && typeof chunk === "string") {
          fullContent += chunk;
          emitToSocket(socketId, "message_chunk", { chunk, chatId });
        }
      }
    }
  }

  emitToSocket(socketId, "typing", { isTyping: false, chatId });
  return fullContent;
};
