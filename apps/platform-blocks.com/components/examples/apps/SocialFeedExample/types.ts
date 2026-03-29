export interface FeedUser {
  id: string;
  name: string;
  avatar: string; // URL or local asset
  handle: string;
  verified?: boolean;
}

export interface FeedPost {
  id: string;
  userId: string;
  image: string; // URL or local asset (first image for convenience)
  images?: string[]; // optional additional images for album posts
  caption: string;
  liked: boolean;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  saved?: boolean;
}
