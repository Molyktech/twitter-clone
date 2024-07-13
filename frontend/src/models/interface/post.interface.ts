export interface IPost {
  _id: string;
  text: string;
  image?: string;
  user: {
    _id: string;
    userName: string;
    profileImg: string;
    fullName: string;
  };
  comments: {
    _id: string;
    text: string;
    user: {
      userName: string;
      profileImg: string;
      fullName: string;
    };
  }[];
  likes: string[];
}


export interface ICreatePost {
  text: string;
  image?: string;
}

export interface IPostSuccessResponse {
  user: string;
  text: string;
  image: string;
}
