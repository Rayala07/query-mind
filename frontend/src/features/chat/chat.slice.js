import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null,
    isTyping: false,
  },

  reducers: {
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;

      state.chats[chatId] = {
        id: chatId,
        title,
        messages: [],
        lastUpdated: new Date().toISOString(),
      };
    },
    addNewMessage: (state, action) => {
      const { chatId, content, role } = action.payload;
      state.chats[chatId].messages.push({ content, role });
    },
    // New Reducer: Appends a text chunk to the very last message in the chat
    // This is fired repeatedly by our Socket.IO listener as the AI streams its response
    appendMessageChunk: (state, action) => {
      const { chatId, chunk } = action.payload;
      const chat = state.chats[chatId];
      if (chat && chat.messages.length > 0) {
        // Get the last message in the list
        const lastMessage = chat.messages[chat.messages.length - 1];
        // Only append if the last message is from the AI, to prevent accidental user message edits
        if (lastMessage.role === "ai") {
          lastMessage.content += chunk;
        }
      }
    },
    addMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      state.chats[chatId].messages.push(...messages);
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    deleteChat: (state, action) => {
      const { chatId } = action.payload;
      delete state.chats[chatId];
      if (state.currentChatId === chatId) {
        state.currentChatId = null;
      }
    },
  },
});

export const {
  createNewChat,
  addNewMessage,
  addMessages,
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  appendMessageChunk,
  setTyping,
  deleteChat,
} = chatSlice.actions;
export default chatSlice.reducer;
