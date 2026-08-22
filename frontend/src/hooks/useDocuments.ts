import { useState } from 'react';
import { DocumentItem } from '@/types/chat';
import { mockDocuments as initialDocs } from '@/lib/mockData';
import { ApiService } from '@/services/api.service';

export function useDocuments() {
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

  return {
    documents,
    dragging,
    uploading,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handleDelete,
  };
}
