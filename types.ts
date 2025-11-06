
export enum AppState {
  INITIAL,
  GENERATING,
  EDITOR,
}

export interface CardData {
  id: string;
  title: string;
  content: string;
  imagePrompt: string;
  layout: string;
  imageUrl?: string;
}
