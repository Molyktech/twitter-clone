import { useQuery } from "@tanstack/react-query";
import { IPost } from "../../models";
import { getPostEndpoint, getPosts } from "../../utils/api";
import { QUERY_KEY } from "../../utils/constants";
import PostSkeleton from "../skeletons/PostSkeleton";
import Post from "./Post";
import { useEffect } from "react";

const Posts = ({ feedType }: { feedType: string }) => {
  const POST_ENDPOINT = getPostEndpoint(feedType);

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery<IPost[]>({
    queryKey: [QUERY_KEY.posts],
    queryFn: () => getPosts(POST_ENDPOINT),
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch]);

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
    </>
  );
};
export default Posts;

5587;
