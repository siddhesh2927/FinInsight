export type DocumentStore = {
  files: string[];
  addFile: (file: string) => void;
};

export const documentStore = {
  files: [],
  addFile(file: string) {
    this.files.push(file);
  },
};
