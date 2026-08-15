import { useState, useEffect, useCallback, useRef } from 'react';
import { Message } from '../types/chat';
import { initialMessages } from '../lib/mockData';
import { ApiService } from '../services/api.service';

const thinkingSteps = [
  'Classifying query...',
  'Retrieving financial data...',
  'Searching documents...',
  'Combining insights...',
];

export function useChatState(initialQuery: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize messages
  useEffect(() => {
    if (initialQuery === 'Why did Q3 profit decline?') {
      setMessages(initialMessages);
    } else if (initialQuery) {
      setMessages([
        {
          id: '1',
          role: 'user',
          text: initialQuery,
        },
        {
          id: '2',
          role: 'ai',
          text: 'Analyzing your query across connected financial data and documents...',
          queryType: 'HYBRID',
          hasMetrics: true,
          hasChart: true,
          hasSQL: true,
          hasSources: true,
          sqlExpanded: false,
          sourcesExpanded: false,
        },
      ]);
    }
  }, [initialQuery]);

  const toggleSQL = useCallback((id: string) => {
    setMessages((msgs) =>
      msgs.map((m) => (m.id === id ? { ...m, sqlExpanded: !m.sqlExpanded } : m))
    );
  }, []);

  const toggleSources = useCallback((id: string) => {
    setMessages((msgs) =>
      msgs.map((m) => (m.id === id ? { ...m, sourcesExpanded: !m.sourcesExpanded } : m))
    );
  }, []);

  const handleSend = useCallback(async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || thinking) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: queryText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setThinking(true);
    setThinkingStep(0);

    // Increment thinking steps
    let currentStep = 0;
    timerRef.current = setInterval(() => {
      currentStep += 1;
      if (currentStep < thinkingSteps.length) {
        setThinkingStep(currentStep);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 600);

    try {
      const response = await ApiService.sendQuery(queryText);
      if (timerRef.current) clearInterval(timerRef.current);
      setThinking(false);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      if (timerRef.current) clearInterval(timerRef.current);
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'ai',
          text: '⚠️ An error occurred while communicating with the analysis engine. Please try again.',
          queryType: 'HYBRID',
        },
      ]);
    }
  }, [input, thinking]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    messages,
    input,
    setInput,
    thinking,
    thinkingStep,
    thinkingSteps,
    toggleSQL,
    toggleSources,
    handleSend,
  };
}
