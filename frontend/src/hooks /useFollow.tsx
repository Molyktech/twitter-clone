import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUnfollowUser } from "../utils/api";
import { IFollowResponse } from "../models";
import { ErrorResponse } from "../models/type/auth";
import toast from "react-hot-toast";
import { QUERY_KEY } from "../utils/constants";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: followUnfollowMutation, isPending } = useMutation<
    IFollowResponse,
    ErrorResponse,
    string
  >({
    mutationFn: (userId: string) => followUnfollowUser(userId),
    onSuccess: (data: IFollowResponse) => {
      Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.suggestedUsers],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.user],
        }),
      ]);

      toast.success(data.message || "User followed successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { followUnfollowMutation, isPending };
};

export default useFollow;
