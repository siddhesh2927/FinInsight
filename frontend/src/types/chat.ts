export type Screen = 'dashboard' | 'chat' | 'documents' | 'datasets' | 'history' | 'settings';
export type QueryType = 'SQL' | 'RAG' | 'HYBRID';
export type DocStatus = 'Indexed' | 'Processing' | 'Failed';
export type DatasetStatus = 'Connected' | 'Processing';

export interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  queryType?: QueryType;
  hasMetrics?: boolean;
  hasChart?: boolean;
  hasSQL?: boolean;
  hasSources?: boolean;
  sqlExpanded?: boolean;
  sourcesExpanded?: boolean;
}

export interface DocumentItem {
  id: number;
  name: string;
  pages: number;
  status: DocStatus;
  indexed: string;
  vectors: number;
}

export interface DatasetItem {
  id: number;
  name: string;
  rows: number;
  cols: number;
  company: string;
  imported: string;
  status: DatasetStatus;
}

export interface QueryHistoryItem {
  id: number;
  question: string;
  type: QueryType;
  date: string;
  preview: string;
}
