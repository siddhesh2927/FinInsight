'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Send, History, Sparkles, Download, FileText, Database } from 'lucide-react';
import { useChatState } from '../../../hooks/useChatState';
import { QueryBadge } from '../../../components/chat/QueryBadge';
import { ThinkingIndicator } from '../../../components/chat/ThinkingIndicator';
import { MetricCard } from '../../../components/analytics/MetricCard';
import { RevenueProfitChart } from '../../../components/analytics/RevenueProfitChart';
import { SQLViewer } from '../../../components/sql/SQLViewer';
import { SourcesPanel } from '../../../components/sources/SourcesPanel';
import { mockHistory } from '../../../lib/mockData';

function ChatWorkspace() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Default to Q3 profit decline query if none provided
  const queryParam = searchParams.get('q') || 'Why did Q3 profit decline?';

  const {
    messages,
    input,
    setInput,
    thinking,
    thinkingStep,
    thinkingSteps,
    toggleSQL,
    toggleSources,
    handleSend,
  } = useChatState(queryParam);

  const handleHistoryReopen = (q: string) => {
    router.push(`/dashboard/chat?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="flex flex-1 overflow-hidden h-full bg-[#f8fafc]">
      
      {/* Sidebar: Chat conversations */}
      <div className="w-56 border-r border-[#e2e5ed] bg-white flex-shrink-0 flex flex-col h-full hidden md:flex">
        <div className="p-4 border-b border-[#e2e5ed] flex items-center gap-2">
          <History size={14} className="text-[#6b7280]" />
          <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">Conversations</p>
        </div>
        <div className="flex-1 overflow-y-auto py-2 px-2.5 space-y-1">
          {mockHistory.map((h) => {
            const isActive = h.question === queryParam;
            return (
              <button
                key={h.id}
                onClick={() => handleHistoryReopen(h.question)}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-200 cursor-pointer
                  ${isActive 
                    ? 'border-[#1a4fcc]/20 bg-[#f0f4ff] text-[#1a4fcc]' 
                    : 'border-transparent text-[#4b5563] hover:bg-[#f7f8fa] hover:text-[#0d1117]'
                  }`}
              >
                <p className="text-xs font-semibold leading-tight line-clamp-2">{h.question}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`text-[8px] font-mono font-bold px-1 py-0.5 rounded border
                    ${h.type === 'SQL' ? 'bg-violet-50 border-violet-100 text-violet-600' :
                      h.type === 'RAG' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                      'bg-blue-50 border-blue-100 text-blue-600'
                    }`}
                  >
                    {h.type}
                  </span>
                  <span className="text-[9px] text-[#9ca3af] font-medium">{h.date.split('·')[1]?.trim() || ''}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main interactive thread */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="animate-fade-in">
              {msg.role === 'user' ? (
                /* User query bubble */
                <div className="flex justify-end">
                  <div className="max-w-xl bg-[#1a4fcc] text-white px-4 py-3 rounded-2xl rounded-tr-xs shadow-sm">
                    <p className="text-xs font-semibold leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ) : (
                /* AI analysis structured layout */
                <div className="max-w-3xl space-y-4">
                  {/* Badge */}
                  {msg.queryType && (
                    <div className="flex items-center gap-2">
                      <QueryBadge type={msg.queryType} />
                    </div>
                  )}

                  {/* Metric Highlights Grid */}
                  {msg.hasMetrics && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <MetricCard label="Revenue" value="$24.8M" change="7.4%" positive sub="vs Q2" />
                      <MetricCard label="Op. Expenses" value="$18.2M" change="18.2%" positive={false} sub="vs Q2" />
                      <MetricCard label="Net Profit" value="$4.1M" change="12.4%" positive={false} sub="vs Q2" />
                      <MetricCard label="Profit Margin" value="16.5%" change="2.4pp" positive={false} sub="vs Q2" />
                    </div>
                  )}

                  {/* AI Response Text Box */}
                  <div className="bg-white border border-[#e2e5ed] rounded-xl p-5 shadow-xs">
                    <p className="text-xs leading-relaxed text-[#0d1117] whitespace-pre-line font-medium">
                      {msg.text.replace(/\*\*([^*]+)\*\*/g, '$1')}
                    </p>
                  </div>

                  {/* Recharts chart component */}
                  {msg.hasChart && <RevenueProfitChart />}

                  {/* Inspection button toggles */}
                  {(msg.hasSQL || msg.hasSources) && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {msg.hasSQL && (
                        <button
                          onClick={() => toggleSQL(msg.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer
                            ${msg.sqlExpanded 
                              ? 'bg-violet-50 border-violet-200 text-violet-700 shadow-2xs' 
                              : 'bg-white border-[#e2e5ed] text-[#4b5563] hover:bg-[#f7f8fa]'
                            }`}
                        >
                          <Database size={13} />
                          <span>View SQL {msg.sqlExpanded ? '▲' : '▼'}</span>
                        </button>
                      )}
                      {msg.hasSources && (
                        <button
                          onClick={() => toggleSources(msg.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer
                            ${msg.sourcesExpanded 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-2xs' 
                              : 'bg-white border-[#e2e5ed] text-[#4b5563] hover:bg-[#f7f8fa]'
                            }`}
                        >
                          <FileText size={13} />
                          <span>View Sources {msg.sourcesExpanded ? '▲' : '▼'}</span>
                        </button>
                      )}
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#e2e5ed] bg-white text-[#4b5563] hover:bg-[#f7f8fa] transition-colors ml-auto cursor-pointer">
                        <Download size={13} />
                        <span>Export Analysis</span>
                      </button>
                    </div>
                  )}

                  {/* SQL viewer panels */}
                  {msg.sqlExpanded && <SQLViewer />}

                  {/* Sources panel */}
                  {msg.sourcesExpanded && <SourcesPanel />}
                </div>
              )}
            </div>
          ))}

          {/* Reasoning animation */}
          {thinking && (
            <ThinkingIndicator stepText={thinkingSteps[thinkingStep]} />
          )}
        </div>

        {/* Floating bottom query input */}
        <div className="border-t border-[#e2e5ed] bg-white px-6 py-4 flex-shrink-0 z-10">
          <div className="flex items-center gap-3 bg-[#f7f8fa] border border-[#e2e5ed] rounded-xl px-4 py-2.5 focus-within:border-[#1a4fcc] focus-within:bg-white focus-within:shadow-xs transition-all duration-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a follow-up question..."
              className="flex-1 text-xs text-[#0d1117] placeholder:text-[#9ca3af] outline-none bg-transparent"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || thinking}
              aria-label="Send query"
              className="w-8 h-8 flex items-center justify-center bg-[#1a4fcc] text-white rounded-lg hover:bg-[#1642b0] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer flex-shrink-0"
            >
              <Send size={13} fill={input.trim() ? "white" : "none"} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex-1 flex items-center justify-center bg-[#f8fafc]">
          <div className="flex flex-col items-center gap-3 font-mono text-xs text-[#6b7280]">
            <Sparkles className="animate-pulse text-[#1a4fcc]" size={24} />
            <span>Initializing Workspace...</span>
          </div>
        </div>
      }
    >
      <ChatWorkspace />
    </Suspense>
  );
}
