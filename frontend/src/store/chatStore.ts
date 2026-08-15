export type ChatStore = {
  messages: Array<{ id: string; role: 'user' | 'assistant'; content: string }>;
  setMessages: (messages: ChatStore['messages']) => void;
};

export const chatStore = {
  messages: [],
  setMessages(messages: ChatStore['messages']) {
    this.messages = messages;
  },
};
