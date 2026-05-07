export interface Channel {
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
