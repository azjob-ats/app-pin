export interface EffectListCardItem {
  postId: string;
  title: string;
  titleLink: string;
  thumbnailUrl: string;
  short?: string;
}

export interface EffectListCardChannel {
  profilePicture: string;
  profileNameOfficial: string;
  verified: boolean;
}

export interface EffectListCardMedia {
  id: string;
  channel: EffectListCardChannel;
  items: EffectListCardItem[];
}
