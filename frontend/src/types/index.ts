export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Tweet {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
  author: User;
  sharedWith?: TweetShare[];
}

export interface TweetShare {
  id: string;
  tweetId: string;
  sharedWithId: string;
  createdAt: string;
  sharedWithUser: User;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface CreateTweetData {
  content: string;
  sharedWithUserIds?: string[];
}
