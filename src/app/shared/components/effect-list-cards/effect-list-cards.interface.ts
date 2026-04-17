export interface EffectListCardItem {
  thumbnailUrl: string;
}

export interface EffectListCardChannel {
  profilePicture: string;
  profileNameOfficial: string;
  verified: boolean;
}

export interface EffectListCardMedia {
  id: string;
  coverUrl: string;
  title: string;
  channel: EffectListCardChannel;
  items: EffectListCardItem[];
}
