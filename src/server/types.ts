export interface ContentItem {
  id: number;
  name: string;
  type: 'image' | 'url';
  content: string;
}

export interface APIResponse<T> {
  data?: T;
  error?: string;
  details?: string;
}
