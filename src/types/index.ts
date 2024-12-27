export interface ContentItem {
  id: number;
  name: string;
  content: string;
  type: 'image' | 'url';
  duration: number;
}

export interface DisplayState {
  currentContent: ContentItem | null;
  isLoading: boolean;
  error: string | null;
}