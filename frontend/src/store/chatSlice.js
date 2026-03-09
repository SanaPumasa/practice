import { createSlice } from '@reduxjs/toolkit';

const createNewChat = () => ({
  id: Date.now(),
  title: 'New Chat',
  messages: [
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date().toISOString(),
    },
  ],
  createdAt: new Date().toISOString(),
});

const initialState = {
  chats: [createNewChat()],
  activeChatId: Date.now(),
  isTyping: false,
};

// Fix the activeChatId to match the first chat
initialState.activeChatId = initialState.chats[0].id;

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat) {
        chat.messages.push(message);
      }
    },
    updateChatTitle: (state, action) => {
      const { chatId, title } = action.payload;
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat) {
        chat.title = title;
      }
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    createChat: (state) => {
      const newChat = createNewChat();
      state.chats.unshift(newChat);
      state.activeChatId = newChat.id;
      state.isTyping = false;
    },
    setActiveChat: (state, action) => {
      state.activeChatId = action.payload;
      state.isTyping = false;
    },
    deleteChat: (state, action) => {
      const chatId = action.payload;
      if (state.chats.length === 1) {
        const newChat = createNewChat();
        state.chats = [newChat];
        state.activeChatId = newChat.id;
      } else {
        state.chats = state.chats.filter((chat) => chat.id !== chatId);
        if (chatId === state.activeChatId) {
          state.activeChatId = state.chats[0].id;
        }
      }
    },
    resetMessages: (state) => {
      const chat = state.chats.find((c) => c.id === state.activeChatId);
      if (chat) {
        chat.messages = [
          {
            id: Date.now(),
            text: "Hello! I'm your AI assistant. How can I help you today?",
            sender: 'ai',
            timestamp: new Date().toISOString(),
          },
        ];
        chat.title = 'New Chat';
      }
      state.isTyping = false;
    },
  },
});

export const {
  addMessage,
  updateChatTitle,
  setTyping,
  createChat,
  setActiveChat,
  deleteChat,
  resetMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
