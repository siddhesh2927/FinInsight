export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
};

export type ChatQueryType = 'Revenue' | 'Profit' | 'Forecast' | 'Risk';
