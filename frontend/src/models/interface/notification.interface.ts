export interface INotification {
  _id: string;
  type: string;
  user: {
    _id: string;
    userName: string;
    profileImg: string;
  };
  post: {
    _id: string;
    image: string;
  };
  text: string;
  isRead: boolean;
}
