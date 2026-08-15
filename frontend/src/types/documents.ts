export type UploadedDocument = {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  status: 'ready' | 'processing' | 'error';
};
