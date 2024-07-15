import { INotification } from "./notification.interface";

export interface IUser {
  _id: string;
  userName: string;
  fullName: string;
  profileImg: string;
  coverImg: string;
  bio?: string;
  link?: string;
  followers?: string[];
  following?: string[];
  likedPosts?: string[];
  notification?: INotification[];
  comments?: {
    _id: string;
    user: {
      _id: string;
      userName: string;
      profileImg: string;
    };
    text: string;

    isRead: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface IFollowResponse {
  message: string;
  user: IUser;
}
