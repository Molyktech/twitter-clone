import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { IUser } from "../../models";
import { getSuggestedUsers } from "../../utils/api";
import { QUERY_KEY } from "../../utils/constants";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import useFollow from "../../hooks /useFollow";
import LoadingSpinner from "./LoadingSpinner";
import { useState } from "react";

const RightPanel = () => {
  const [btnIndex, setBtnIndex] = useState<number>(0);
  const { data: suggestedUsersQuery, isLoading } = useQuery<IUser[]>({
    queryKey: [QUERY_KEY.suggestedUsers],
    queryFn: getSuggestedUsers,
  });

  const { followUnfollowMutation, isPending } = useFollow();

  if (suggestedUsersQuery?.length === 0)
    return <div className="mf:w-64 w-0"></div>;

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {/* item */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUsersQuery?.map((user, index) => (
              <Link
                to={`/profile/${user.userName}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.userName}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    disabled={isPending}
                    onClick={(e) => {
                      e.preventDefault();
                      setBtnIndex(index);
                      followUnfollowMutation(user._id);
                    }}
                  >
                    {isPending && btnIndex === index ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      "Follow"
                    )}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
export default RightPanel;
