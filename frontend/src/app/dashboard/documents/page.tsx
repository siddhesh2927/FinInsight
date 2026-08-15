'use client';

import { useState } from 'react';
import { Upload, Trash2, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { mockDocuments as initialDocs } from '../../../lib/mockData';
import { DocumentItem } from '../../../types/chat';
import { ApiService } from '../../../services/api.service';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocs);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFiles = files.filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    
    if (pdfFiles.length > 0) {
      await uploadFile(pdfFiles[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const newDoc = await ApiService.uploadPDF(file);
      setDocuments((prev) => [
        {
          id: newDoc.id || Date.now(),
          name: newDoc.name || file.name,
          pages: newDoc.pages || 12,
          status: 'Indexed',
          indexed: newDoc.indexed || 'Just now',
          vectors: newDoc.vectors || 120,
        },
        ...prev
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: number) => {
    setDocuments((prev) => prev.filter(d => d.id !== id));
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0d1117]">Documents</h2>
            <p className="text-xs text-[#6b7280] mt-0.5">PDF filings and transcripts processed for vector retrieval</p>
          </div>
          
          <label className="flex items-center gap-2 px-4 py-2 bg-[#1a4fcc] text-white text-xs font-bold rounded-lg hover:bg-[#1642b0] shadow-sm transition-colors cursor-pointer select-none">
            <Upload size={13} />
            <span>Upload PDF</span>
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Upload Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
            ${dragging 
              ? 'border-[#1a4fcc] bg-[#f0f4ff]' 
              : 'border-[#e2e5ed] bg-white hover:border-[#1a4fcc]/40 hover:bg-[#f7f8fa]'
            }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 text-[#6b7280] ${uploading ? 'animate-pulse bg-blue-50 text-[#1a4fcc]' : ''}`}>
              <Upload size={20} />
            </div>
            {uploading ? (
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#0d1117]">Indexing document...</p>
                <p className="text-xs text-[#6b7280]">Extracting layout and calculating vector embeddings</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#374151]">
                  Drag and drop file here, or <span className="text-[#1a4fcc] hover:underline font-bold">browse files</span>
                </p>
                <p className="text-xs text-[#6b7280]">
                  Annual reports, 10-K filings, or meeting transcripts · PDF up to 50MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Table List */}
        <div className="bg-white border border-[#e2e5ed] rounded-xl overflow-hidden shadow-3xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#e2e5ed] bg-[#f8fafc] text-[#6b7280]">
                  {['File Name', 'Pages', 'Status', 'Indexed', 'Vectors', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 font-bold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f7]">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#f8fafc] transition-colors group">
                    {/* File Name Info */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-10 bg-red-50 border border-red-100 rounded-lg flex flex-col items-center justify-center flex-shrink-0 shadow-2xs">
                          <FileText size={14} className="text-red-500" />
                          <span className="text-[7px] text-red-500 font-extrabold uppercase mt-0.5">PDF</span>
                        </div>
                        <span className="font-bold text-[#0d1117] truncate max-w-[280px]">{doc.name}</span>
                      </div>
                    </td>
                    
                    {/* Pages count */}
                    <td className="px-5 py-3.5 text-[#374151] font-semibold tabular-nums">
                      {doc.pages}
                    </td>
                    
                    {/* Status badge */}
                    <td className="px-5 py-3.5">
                      <StatusBadge status={doc.status} />
                    </td>
                    
                    {/* Indexed Date */}
                    <td className="px-5 py-3.5 text-[#6b7280] font-medium">
                      {doc.indexed}
                    </td>
                    
                    {/* Vector Count */}
                    <td className="px-5 py-3.5 font-mono text-[#6b7280] tabular-nums font-semibold">
                      {doc.vectors ? doc.vectors.toLocaleString() : '—'}
                    </td>
                    
                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <button 
                          aria-label="View PDF properties"
                          className="flex items-center gap-1 text-[11px] text-[#1a4fcc] hover:underline font-bold transition-all cursor-pointer"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          aria-label="Delete document"
                          className="flex items-center gap-1 text-[11px] text-[#9ca3af] hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {documents.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-[#9ca3af] mb-3">
                <FileText size={20} />
              </div>
              <p className="text-sm font-bold text-[#374151]">No financial documents indexed</p>
              <p className="text-xs text-[#6b7280] mt-1 mb-4">Upload annual reports or earnings transcripts to execute search queries.</p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a4fcc] text-white text-xs font-bold rounded-lg hover:bg-[#1642b0] shadow-sm transition-colors cursor-pointer select-none">
                <Upload size={13} />
                <span>Upload PDF</span>
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
