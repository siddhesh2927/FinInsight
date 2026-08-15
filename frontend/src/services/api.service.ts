import { Message, DocumentItem, DatasetItem, QueryHistoryItem } from '../types/chat';
import { mockDocuments, mockDatasets, mockHistory, revenueData } from '../lib/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiService {
  /**
   * Send a query to the AI reasoning engine (SQL + RAG)
   */
  static async sendQuery(queryText: string): Promise<Message> {
    // Simulated API call latency
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simple custom responses based on content for realism
    const lowerText = queryText.toLowerCase();
    
    if (lowerText.includes('q3 profit') || lowerText.includes('decline')) {
      return {
        id: Date.now().toString(),
        role: 'ai',
        text: "Q3 net profit declined by **12.4%** quarter-over-quarter, dropping from $5.2M to $4.1M. Despite revenue growing 7.4% to $24.8M, operating expenses surged 18.2% to $18.2M — driven primarily by a 24% increase in personnel costs and a $1.1M one-time restructuring charge cited in the Q3 earnings transcript.\n\nThe operating margin compressed from 22.5% in Q2 to 16.5% in Q3, the lowest point in the trailing four quarters.",
        queryType: 'HYBRID',
        hasMetrics: true,
        hasChart: true,
        hasSQL: true,
        hasSources: true,
        sqlExpanded: false,
        sourcesExpanded: false,
      };
    }

    if (lowerText.includes('compare') || lowerText.includes('revenue')) {
      return {
        id: Date.now().toString(),
        role: 'ai',
        text: "Comparing quarterly performance, revenues increased steadily from **$21.4M in Q1** to **$23.1M in Q2**, and further reached **$24.8M in Q3**. While revenue peaked at **$26.3M in Q4**, margins showed volatility, especially the dip down to 16.5% in Q3 due to non-recurring operational cost adjustments.\n\nOverall annual trend shows strong top-line demand offset by mid-year cost expansions.",
        queryType: 'SQL',
        hasMetrics: true,
        hasChart: true,
        hasSQL: true,
        hasSources: false,
        sqlExpanded: false,
        sourcesExpanded: false,
      };
    }

    if (lowerText.includes('risk') || lowerText.includes('annual report')) {
      return {
        id: Date.now().toString(),
        role: 'ai',
        text: "The Annual Report (PDF) highlights the following major risk factors for FY2025:\n\n1. **Market Volatility & Competitor Pricing**: Supply chain pricing pressure affecting component sourcing by 15-20%.\n2. **Personnel Cost Expansion**: Increased investments in software engineering talent and specialized AI researchers.\n3. **Regulatory Auditing**: Expanding international compliance requirements which increased corporate legal expenses by 8.4%.",
        queryType: 'RAG',
        hasMetrics: false,
        hasChart: false,
        hasSQL: false,
        hasSources: true,
        sqlExpanded: false,
        sourcesExpanded: false,
      };
    }

    // Default Fallback Response
    return {
      id: Date.now().toString(),
      role: 'ai',
      text: `Based on the financial data and connected documents: "${queryText}". Revenue growth has been consistent at approximately 7% quarter-over-quarter. Operating expenses are currently within expected ranges except for Q3 personnel anomalies. Margins remain healthy at an average of 21%.`,
      queryType: 'HYBRID',
      hasMetrics: true,
      hasChart: true,
      hasSQL: true,
      hasSources: true,
      sqlExpanded: false,
      sourcesExpanded: false,
    };
  }

  /**
   * Upload PDF document to backend RAG processor
   */
  static async uploadPDF(file: File): Promise<Partial<DocumentItem>> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      id: Date.now(),
      name: file.name,
      pages: Math.floor(Math.random() * 80) + 10,
      status: 'Indexed',
      indexed: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      vectors: Math.floor(Math.random() * 500) + 100,
    };
  }

  /**
   * Upload CSV dataset for structured database analysis
   */
  static async uploadCSV(file: File): Promise<Partial<DatasetItem>> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      id: Date.now(),
      name: file.name,
      rows: Math.floor(Math.random() * 5000) + 500,
      cols: Math.floor(Math.random() * 15) + 5,
      company: 'FinCorp Inc.',
      imported: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Connected',
    };
  }

  /**
   * Fetch connected documents
   */
  static async getDocuments(): Promise<DocumentItem[]> {
    return mockDocuments;
  }

  /**
   * Fetch connected datasets
   */
  static async getDatasets(): Promise<DatasetItem[]> {
    return mockDatasets;
  }

  /**
   * Fetch query histories
   */
  static async getHistory(): Promise<QueryHistoryItem[]> {
    return mockHistory;
  }
}
