export type CategoryTag = 'Tất cả' | 'Only BG' | 'Only BL' | 'BG/BL' | string;

export interface CharacterCard {
  id: string;
  name: string;
  tag: 'Hiện đại' | 'Cổ trang' | string;
  tagsList?: string[];
  imageUrl: string;
  imagesList?: string[];
  chatUrl: string;
  copyLink?: string;
  plotUrl?: string;
  plotContent?: string;
  chatNotice?: string;
  description?: string;
  author?: string;
  greeting?: string;
  personality?: string;
  note?: string;
  context?: string;
  collabNote?: string;
  collabUrl?: string;
  likesCount?: number;
  isFavorite?: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}
