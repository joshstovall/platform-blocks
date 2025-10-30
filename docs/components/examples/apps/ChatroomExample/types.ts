export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface ReplyTo {
  id: number;
  user: string;
  message: string;
}

export interface Message {
  id: number;
  user: string;
  avatar: string;
  avatarUrl?: string;
  message: string;
  time: string;
  date: string;
  isOwn: boolean;
  status?: MessageStatus;
  reaction?: string;
  isOnline?: boolean;
  userColor?: string;
  replyTo?: ReplyTo;
}

export const USER_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
  '#F8B500', '#6C5CE7', '#A29BFE', '#FD79A8', '#E17055'
];
