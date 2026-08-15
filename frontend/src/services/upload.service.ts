export async function uploadDocument(file: File) {
  return { fileName: file.name, status: 'uploaded' };
}
