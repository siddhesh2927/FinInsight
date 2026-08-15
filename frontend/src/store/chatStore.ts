export type ChatStore = {
  messages: Array<{ id: string; role: 'user' | 'assistant'; content: string }>;
  setMessages: (messages: ChatStore['messages']) => void;
};

export const chatStore: ChatStore = {
  messages: [],
  setMessages(messages: ChatStore['messages']) {
    this.messages = messages;
  },
};
