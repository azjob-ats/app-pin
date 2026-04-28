import { PostChannel, PostComments } from '@shared/interfaces/entity/post';

export type WinningSlotAspectRatio = '9:16' | '16:9';

export type WinningSlotContentType = 'movie' | 'image' | 'html' | 'component';

export type WinningSlotKind = 'ad' | 'recommendation' | 'informative' | 'interactive';

interface WinningSlotMediaBase {
  id: string;
  aspectRatio: WinningSlotAspectRatio;
  contentType: WinningSlotContentType;
  guidance: 'portrait' | 'landscape';
  resolution: string | null;
  title: string;
  titleLink: string;
  description: string;
  slang?: string[];
  thumbnail?: string;
  link?: string;
  cta?: string;
}

export interface WinningSlotMovieMedia extends WinningSlotMediaBase {
  contentType: 'movie';
  long: string;
  short?: string;
}

export interface WinningSlotImageMedia extends WinningSlotMediaBase {
  contentType: 'image';
  image: string;
}

export interface WinningSlotHtmlMedia extends WinningSlotMediaBase {
  contentType: 'html';
  html: string;
  css?: string;
}

export interface WinningSlotComponentMedia extends WinningSlotMediaBase {
  contentType: 'component';
  componentId: string;
  props?: Record<string, unknown>;
}

export type WinningSlotMedia =
  | WinningSlotMovieMedia
  | WinningSlotImageMedia
  | WinningSlotHtmlMedia
  | WinningSlotComponentMedia;

export interface WinningSlot {
  id: string;
  postType: 'winning-slot';
  slotKind: WinningSlotKind;
  timestamp: string;
  isLiked: boolean;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  isReported: boolean;
  isBlocked: boolean;
  media: WinningSlotMedia;
  channel: PostChannel;
  comment: PostComments;
}
