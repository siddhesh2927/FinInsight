'use client';

import { useState } from 'react';
import { Database, Upload, Eye, TableProperties, ChevronDown, ChevronUp } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { mockDatasets as initialDatasets } from '../../../lib/mockData';
import { DatasetItem } from '../../../types/chat';
import { ApiService } from '../../../services/api.service';

const previewData = [
  { company: 'FinCorp Inc.', year: 2025, quarter: 'Q1', revenue: 21.4, opex: 16.6, profit: 4.8, margin: '22.4%' },
  { company: 'FinCorp Inc.', year: 2025, quarter: 'Q2', revenue: 23.1, opex: 17.9, profit: 5.2, margin: '22.5%' },
  { company: 'FinCorp Inc.', year: 2025, quarter: 'Q3', revenue: 24.8, opex: 18.2, profit: 4.1, margin: '16.5%' },
  { company: 'FinCorp Inc.', year: 2025, quarter: 'Q4', revenue: 26.3, opex: 17.8, profit: 5.9, margin: '22.4%' },
];

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<DatasetItem[]>(initialDatasets);
  const [previewId, setPreviewId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePreviewToggle = (id: number) => {
    setPreviewId(previewId === id ? null : id);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploading(true);
      try {
        const newDs = await ApiService.uploadCSV(files[0]);
        setDatasets((prev) => [
          {
            id: newDs.id || Date.now(),
            name: newDs.name || files[0].name,
            rows: newDs.rows || 100,
            cols: newDs.cols || 5,
            company: newDs.company || 'FinCorp Inc.',
            imported: newDs.imported || 'Just now',
            status: 'Connected',
          },
          ...prev,
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    }
  };

  const activeDataset = datasets.find((d) => d.id === previewId);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0d1117]">Datasets</h2>
            <p className="text-xs text-[#6b7280] mt-0.5">Structured database tables connected for SQL-based queries</p>
          </div>
          
          <label className="flex items-center gap-2 px-4 py-2 bg-[#1a4fcc] text-white text-xs font-bold rounded-lg hover:bg-[#1642b0] shadow-sm transition-colors cursor-pointer select-none">
            <Upload size={13} />
            <span>Upload CSV</span>
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Upload Status Card */}
        {uploading && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3 animate-pulse">
            <Database size={16} className="text-[#1a4fcc]" />
            <span className="text-xs font-bold text-[#1a4fcc]">Analyzing CSV headers and structuring database table...</span>
          </div>
        )}

        {/* Datasets List */}
        <div className="grid gap-4">
          {datasets.map((ds) => {
            const isPreviewing = previewId === ds.id;
            return (
              <div 
                key={ds.id} 
                className={`bg-white border rounded-xl p-5 transition-all duration-200 hover:shadow-xs
                  ${isPreviewing ? 'border-[#1a4fcc]' : 'border-[#e2e5ed]'}`}
              >
                <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                  {/* Icon Card */}
                  <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-lg flex flex-col items-center justify-center flex-shrink-0 shadow-2xs">
                    <TableProperties size={18} className="text-emerald-600" />
                    <span className="text-[7px] text-emerald-600 font-extrabold uppercase mt-0.5">CSV</span>
                  </div>

                  {/* Title & Metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold text-[#0d1117] truncate">{ds.name}</span>
                      <StatusBadge status={ds.status} />
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-[#6b7280] font-semibold flex-wrap">
                      <span className="font-mono">{ds.rows.toLocaleString()} rows</span>
                      <span className="font-mono">{ds.cols} columns</span>
                      <span>·</span>
                      <span>{ds.company}</span>
                      <span>·</span>
                      <span>Imported {ds.imported}</span>
                    </div>
                  </div>

                  {/* Preview Trigger */}
                  <button
                    onClick={() => handlePreviewToggle(ds.id)}
                    aria-label={`Preview ${ds.name}`}
                    className={`flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold border rounded-lg transition-all cursor-pointer
                      ${isPreviewing 
                        ? 'bg-[#f0f4ff] border-[#1a4fcc]/30 text-[#1a4fcc]' 
                        : 'bg-white border-[#e2e5ed] text-[#4b5563] hover:bg-[#f7f8fa]'
                      }`}
                  >
                    <span>{isPreviewing ? 'Hide Preview' : 'Preview'}</span>
                    {isPreviewing ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dataset Preview Grid */}
        {activeDataset && (
          <div className="bg-white border border-[#1a4fcc]/30 rounded-xl overflow-hidden shadow-xs animate-fade-in">
            <div className="px-5 py-4 border-b border-[#e2e5ed] flex items-center justify-between bg-slate-50/50">
              <div>
                <p className="text-xs font-bold text-[#0d1117]">{activeDataset.name} · Structure View</p>
                <p className="text-[10px] text-[#6b7280] mt-0.5">Displaying sample rows from relational table schema</p>
              </div>
              <span className="text-[10px] font-mono font-semibold text-[#6b7280] bg-white border border-[#e2e5ed] px-2 py-0.5 rounded-md">
                Showing 4 of {activeDataset.rows} rows
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e5ed] text-[#6b7280]">
                    {['Company', 'Year', 'Quarter', 'Revenue', 'Op. Expense', 'Net Profit', 'Margin'].map((h) => (
                      <th key={h} className="text-left px-5 py-3.5 font-bold uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f2f7]">
                  {previewData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#f8fafc]/50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-[#0d1117]">{row.company}</td>
                      <td className="px-5 py-3.5 font-mono text-[#374151] tabular-nums font-semibold">{row.year}</td>
                      <td className="px-5 py-3.5 font-mono text-[#374151] font-semibold">{row.quarter}</td>
                      <td className="px-5 py-3.5 font-mono text-right font-semibold text-[#0d1117]">${row.revenue}M</td>
                      <td className="px-5 py-3.5 font-mono text-right font-semibold text-[#374151]">${row.opex}M</td>
                      <td className={`px-5 py-3.5 font-mono text-right font-semibold ${row.profit < 5 ? 'text-rose-500' : 'text-emerald-600'}`}>
                        ${row.profit}M
                      </td>
                      <td className={`px-5 py-3.5 font-mono text-right font-bold ${parseFloat(row.margin) < 20 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {row.margin}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
