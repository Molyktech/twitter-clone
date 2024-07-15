export interface INotification {
  _id: string;
  type: string;
  from?: {
    _id: string;
    userName: string;
    profileImg: string;
  };
  read: boolean;

  to: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
