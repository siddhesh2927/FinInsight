export type UIStore = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export const uiStore = {
  sidebarOpen: true,
  setSidebarOpen(open: boolean) {
    this.sidebarOpen = open;
  },
};
