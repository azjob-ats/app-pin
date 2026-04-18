export interface ShopWindowItem {
  postId: string;
  title: string;
  thumbnailUrl: string;
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
