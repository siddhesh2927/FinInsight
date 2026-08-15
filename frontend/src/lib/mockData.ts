import { DocumentItem, DatasetItem, QueryHistoryItem, Message } from '../types/chat';

export const revenueData = [
  { quarter: 'Q1', revenue: 21.4, profit: 4.8, expenses: 16.6, margin: 22.4 },
  { quarter: 'Q2', revenue: 23.1, profit: 5.2, expenses: 17.9, margin: 22.5 },
  { quarter: 'Q3', revenue: 24.8, profit: 4.1, expenses: 18.2, margin: 16.5 },
  { quarter: 'Q4', revenue: 26.3, profit: 5.9, expenses: 17.8, margin: 22.4 },
];

export const mockDocuments: DocumentItem[] = [
  { id: 1, name: 'Annual_Report_2025.pdf', pages: 148, status: 'Indexed', indexed: 'Aug 12, 2026', vectors: 1248 },
  { id: 2, name: 'Q3_Earnings_Transcript.pdf', pages: 34, status: 'Indexed', indexed: 'Aug 10, 2026', vectors: 287 },
  { id: 3, name: 'Risk_Assessment_2025.pdf', pages: 62, status: 'Processing', indexed: '—', vectors: 0 },
  { id: 4, name: 'Investor_Presentation.pdf', pages: 28, status: 'Failed', indexed: '—', vectors: 0 },
];

export const mockDatasets: DatasetItem[] = [
  { id: 1, name: 'financial_data_2025.csv', rows: 4280, cols: 12, company: 'FinCorp Inc.', imported: 'Aug 11, 2026', status: 'Connected' },
  { id: 2, name: 'quarterly_metrics.csv', rows: 840, cols: 8, company: 'FinCorp Inc.', imported: 'Aug 8, 2026', status: 'Connected' },
  { id: 3, name: 'expense_breakdown.csv', rows: 1560, cols: 15, company: 'FinCorp Inc.', imported: 'Aug 5, 2026', status: 'Processing' },
];

export const mockHistory: QueryHistoryItem[] = [
  { id: 1, question: 'Why did Q3 profit decline?', type: 'HYBRID', date: 'Aug 14, 2026 · 09:41', preview: 'Q3 profit declined by 12.4% primarily due to a 18.2% rise in operating expenses...' },
  { id: 2, question: 'Compare Q1, Q2 and Q3 revenue', type: 'SQL', date: 'Aug 13, 2026 · 14:22', preview: 'Revenue grew steadily from $21.4M in Q1 to $24.8M in Q3, representing 15.9% growth...' },
  { id: 3, question: 'What risks were mentioned in the annual report?', type: 'RAG', date: 'Aug 13, 2026 · 11:05', preview: 'The annual report highlights three primary risk categories: market volatility...' },
  { id: 4, question: 'Show operating margin by quarter', type: 'SQL', date: 'Aug 12, 2026 · 16:33', preview: 'Operating margins showed a significant dip in Q3 (16.5%) compared to Q1–Q2 average...' },
  { id: 5, question: 'What did the CFO say about cost containment?', type: 'RAG', date: 'Aug 12, 2026 · 10:18', preview: "CFO stated that the company plans to implement cost containment measures in Q4 targeting..." },
];

export const initialMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    text: 'Why did Q3 profit decline?',
  },
  {
    id: '2',
    role: 'ai',
    text: "Q3 net profit declined by **12.4%** quarter-over-quarter, dropping from $5.2M to $4.1M. Despite revenue growing 7.4% to $24.8M, operating expenses surged 18.2% to $18.2M — driven primarily by a 24% increase in personnel costs and a $1.1M one-time restructuring charge cited in the Q3 earnings transcript.\n\nThe operating margin compressed from 22.5% in Q2 to 16.5% in Q3, the lowest point in the trailing four quarters.",
    queryType: 'HYBRID',
    hasMetrics: true,
    hasChart: true,
    hasSQL: true,
    hasSources: true,
    sqlExpanded: false,
    sourcesExpanded: false,
  },
];
