import { useState } from 'react';
import { DatasetItem } from '@/types/chat';
import { mockDatasets as initialDatasets } from '@/lib/mockData';
import { ApiService } from '@/services/api.service';

export function useDatasets() {
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

  return {
    datasets,
    previewId,
    uploading,
    handlePreviewToggle,
    handleFileChange,
  };
}
