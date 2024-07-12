export type LoginCredentials = {
  userName: string;
  password: string;
};

export type RegisterCredentials = {
  email: string;
  fullName: string;
  userName: string;
  password: string;
};

export type SuccessResponse = {
  _id: string;
  fullName: string;
  followers: string;
  following: string;
  profileImg: string;
  coverImg: string;
  userName: string;
  email: string;
  message: string;
};

export type ErrorResponse = {
  error: string;
  message: string;
};


export type DefaultSuccessResponse = {
  message: string;
};