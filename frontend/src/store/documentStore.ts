export type DocumentStore = {
  files: string[];
  addFile: (file: string) => void;
};

export const documentStore: DocumentStore = {
  files: [],
  addFile(file: string) {
    this.files.push(file);
  },
};
