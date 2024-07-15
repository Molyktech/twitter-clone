import { useQuery } from "@tanstack/react-query";
import { IPost } from "../../models";
import { getPostEndpoint, getPosts } from "../../utils/api";
import { QUERY_KEY } from "../../utils/constants";
import PostSkeleton from "../skeletons/PostSkeleton";
import Post from "./Post";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const Posts = ({
  feedType,
  userId,
  userName,
}: {
  feedType: string;
  userName?: string;
  userId?: string;
}) => {
  const POST_ENDPOINT = getPostEndpoint(feedType, userName, userId);

  const {
    data: posts,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<IPost[]>({
    queryKey: [QUERY_KEY.posts],
    queryFn: () => getPosts(POST_ENDPOINT),
  });

  const notify = () => {
    toast.error(error?.message || "Ops.. Error on fetching posts. Try again!");
  };

  useEffect(() => {
    refetch();
  }, [feedType, refetch, userName]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post: unknown) => (
            <Post key={(post as IPost)._id} post={post as IPost} />
          ))}
        </div>
      )}
      <>{isError && notify()}</>
    </>
  );
};
export default Posts;

5587;
