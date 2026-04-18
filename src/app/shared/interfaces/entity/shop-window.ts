export interface ShopWindowItem {
  postId: string;
  title: string;
  titleLink: string;
  thumbnailUrl: string;
  short?: string;
}

export interface ShopWindowChannel {
  profilePicture: string;
  profileNameOfficial: string;
  verified: boolean;
}

export interface ShopWindow {
  id: string;
  channel: ShopWindowChannel;
  items: ShopWindowItem[];
}
