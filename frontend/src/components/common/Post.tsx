import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { BiRepost } from "react-icons/bi";
import { FaRegComment, FaRegHeart, FaTrash } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { IPost, IUser } from "../../models";
import {
  DefaultSuccessResponse,
  ErrorResponse,
  SuccessResponse,
} from "../../models/type/auth";
import { commentOnPost, deletePost, likeUnlikePost } from "../../utils/api";
import { formatPostDate } from "../../utils/date";
import { QUERY_KEY } from "../../utils/constants";
import LoadingSpinner from "./LoadingSpinner";

type PostProps = {
  post: IPost;
};

const Post = ({ post }: PostProps) => {
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery<IUser | SuccessResponse>({
    queryKey: ["authUser"],
  });
  const postOwner = post.user;
  const isLiked = post.likes.length
    ? post.likes.includes(authUser?._id ?? "")
    : false;
  const isMyPost = authUser?._id === post.user?._id;

  const { mutate: deletePostMutation, isPending: isDeleting } = useMutation<
    DefaultSuccessResponse,
    ErrorResponse,
    string,
    unknown
  >({
    mutationFn: async (postId) => deletePost(postId),
    onSuccess: (data: DefaultSuccessResponse) => {
      toast.success(data.message || "Post Deleted");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.posts] });
    },
    onError: (error: ErrorResponse) => {
      const err = "Ops.. Error on delete post. Try again!";
      toast.error(error.message || err);
    },
  });

  const { mutate: likePostMutation, isPending: isLikePending } = useMutation<
    DefaultSuccessResponse,
    ErrorResponse,
    string
  >({
    mutationFn: async (postId) => likeUnlikePost(postId),
    onSuccess: (data: DefaultSuccessResponse) => {
      toast.success(data.message || "Post liked");
      // update the cache
      queryClient.setQueryData<IPost[]>([QUERY_KEY.posts], (oldData) => {
        return oldData?.map((oldPost) => {
          if (oldPost._id === post._id) {
            return {
              ...oldPost,
              likes: data.updatedLikes,
            } as IPost;
          }
          return oldPost;
        }) as IPost[] | undefined;
      });
    },
    onError: (error: ErrorResponse) => {
      const err = "Ops.. Error on like post. Try again!";
      toast.error(error.message || err);
    },
  });

  const { mutate: commentPostMutation, isPending: isCommenting } = useMutation<
    IPost,
    ErrorResponse,
    string
  >({
    mutationFn: async (commentText) => commentOnPost(post._id, commentText),
    onSuccess: (data: IPost) => {
      toast.success("Comment posted");
      setComment("");
      (document.getElementById(
        "comments_modal" + post._id
      ) as HTMLDialogElement)!.close();
      // queryClient.invalidateQueries({ queryKey: [QUERY_KEY.posts] });
      queryClient.setQueryData<IPost[]>([QUERY_KEY.posts], (oldData) => {
        return oldData?.map((oldPost) => {
          if (oldPost._id === post._id) {
            return {
              ...oldPost,
              ...data,
              // comments: data.comments,
            } as IPost;
          }

          return oldPost;
        }) as IPost[] | undefined;
      });
    },
    onError: (error: ErrorResponse) => {
      const err = "Ops.. Error on comment post. Try again!";
      toast.error(error.message || err);
    },
  });

  const handleDeletePost = () => {
    deletePostMutation(post._id);
  };

  const handlePostComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isCommenting || !comment) return;
    commentPostMutation(comment);
  };

  const handleLikePost = () => {
    if (isLikePending) return;
    likePostMutation(post._id);
  };

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.userName}`}
            className="w-8 rounded-full overflow-hidden"
          >
            <img src={postOwner.profileImg || "/avatar-placeholder.png"} />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner.userName}`} className="font-bold">
              {postOwner.fullName}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner.userName}`}>
                @{postOwner.userName}
              </Link>
              <span>·</span>
              <span>{formatPostDate(post.createdAt)}</span>
            </span>
            {isMyPost && (
              <span className="flex justify-end flex-1">
                {isDeleting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <FaTrash
                    className="cursor-pointer hover:text-red-500"
                    onClick={handleDeletePost}
                  />
                )}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.text}</span>
            {post.image && (
              <img
                src={post.image}
                className="h-80 object-contain rounded-lg border border-gray-700"
                alt=""
              />
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center w-2/3 justify-between">
              <div
                className="flex gap-1 items-center cursor-pointer group"
                onClick={() =>
                  (document.getElementById(
                    "comments_modal" + post._id
                  ) as HTMLDialogElement)!.showModal()
                }
              >
                <FaRegComment className="w-4 h-4  text-slate-500 group-hover:text-sky-400" />
                <span className="text-sm text-slate-500 group-hover:text-sky-400">
                  {post.comments.length}
                </span>
              </div>
              {/* We're using Modal Component from DaisyUI */}
              <dialog
                id={`comments_modal${post._id}`}
                className="modal border-none outline-none"
              >
                <div className="modal-box rounded border border-gray-600">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                    {post.comments.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="flex gap-2 items-start">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src={
                                comment.user.profileImg ||
                                "/avatar-placeholder.png"
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold">
                              {comment.user.fullName}
                            </span>
                            <span className="text-gray-700 text-sm">
                              @{comment.user.userName}
                            </span>
                          </div>
                          <div className="text-sm">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                      {isCommenting ? <LoadingSpinner size="sm" /> : "Post"}
                    </button>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none">close</button>
                </form>
              </dialog>
              <div className="flex gap-1 items-center group cursor-pointer">
                <BiRepost className="w-6 h-6  text-slate-500 group-hover:text-green-500" />
                <span className="text-sm text-slate-500 group-hover:text-green-500">
                  0
                </span>
              </div>
              <div
                className="flex gap-1 items-center group cursor-pointer"
                onClick={handleLikePost}
              >
                {isLikePending && <LoadingSpinner size="sm" />}
                {!isLiked && !isLikePending && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
                )}
                {isLiked && !isLikePending && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500 " />
                )}

                <span
                  className={`text-sm  group-hover:text-pink-500 ${
                    isLiked ? "text-pink-500" : "text-slate-500"
                  }`}
                >
                  {post.likes.length}
                </span>
              </div>
            </div>
            <div className="flex w-1/3 justify-end gap-2 items-center">
              <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Post;
