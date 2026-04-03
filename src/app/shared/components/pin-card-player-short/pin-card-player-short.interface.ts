export interface PostMedia {
  contentType: string;
  aspectRatio: string;
  resolution: string;
  guidance: string;
  long: string;
  short?: string;
  thumbnail: string;
  description: string;
  slang: string[];
  id: string;
  title: string;
  photoPreviewIcon: string;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  progress: number;
}

export interface PostChannel {
  id: string;
  profileName: string;
  profileNameOfficial: string;
  profilePicture: string;
  coverPicture: string;
  numberOfFollowers: number;
  numberOfPublication: number;
  numberOfToFollow: number;
  verified: boolean;
  email: string;
  isReported: boolean;
  isBlocked: boolean;
  overview: string;
  visitWebsite: string;
}

export interface PostComment {
  id: number;
  replied: null | number;
  user: string;
  avatar: string;
  text: string;
  time: Date;
  likes: number;
  replies: { totalRecords: number };
}

export interface PostComments {
  data: PostComment[];
  page: number;
  pageSize: number;
  pages: number;
  totalRecords: number;
}

export interface Post {
  id: string;
  postType: string;
  timestamp: string;
  isLiked: boolean;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  isReported: boolean;
  isBlocked: boolean;
  media: PostMedia;
  channel: PostChannel;
  comment: PostComments;
}
