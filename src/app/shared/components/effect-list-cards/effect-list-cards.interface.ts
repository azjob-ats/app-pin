export interface EffectListCardItem {
  postId: string;
  title: string;
  thumbnailUrl: string;
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
