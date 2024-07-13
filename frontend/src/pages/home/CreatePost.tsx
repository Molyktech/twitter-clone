// type Props = {}

import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { FormEvent, useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ICreatePost, IPostSuccessResponse, IUser } from "../../models";
import { ErrorResponse, SuccessResponse } from "../../models/type/auth";
import toast from "react-hot-toast";
import { QUERY_KEY } from "../../utils/constants";
import { createPost } from "../../utils/api";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState<string | ArrayBuffer | null>(null);
  const imgRef = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();
  const { data: authUser } = useQuery<IUser | SuccessResponse>({
    queryKey: ["authUser"],
  });

  const {
    mutate: createPostMutation,
    isPending,
    isError,
    error,
  } = useMutation<IPostSuccessResponse, ErrorResponse, ICreatePost>({
    mutationFn: async ({ text, image }) => createPost({ text, image }),
    onSuccess: () => {
      setText("");
      setImg(null);
      toast.success("Post Created");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.posts] });
    },
    onError: (error: ErrorResponse) => {
      const err = "Ops.. Error on create post. Try again!";
      toast.error(error.message || err);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPostMutation({ text, image: img as string });
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current!.value = "";
              }}
            />
            <img
              src={img as string}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef?.current?.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input type="file" hidden ref={imgRef} onChange={handleImgChange} />
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && (
          <div className="text-red-500">
            {error.message || "Something went wrong"}
          </div>
        )}
      </form>
    </div>
  );
};
export default CreatePost;
