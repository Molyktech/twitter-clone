import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaTrash, FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../utils/constants";
import {
  deleteAllNotifications,
  deleteSingleNotification,
  getAllNotifications,
} from "../../utils/api";
import toast from "react-hot-toast";
import { DefaultSuccessResponse, ErrorResponse } from "../../models/type/auth";
import { INotification } from "../../models";

const Notification = () => {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery<INotification[]>({
    queryKey: [QUERY_KEY.notifications],
    queryFn: getAllNotifications,
  });

  const { mutate: deleteNotificationsMutation, isPending: isDeletingAll } =
    useMutation<DefaultSuccessResponse, ErrorResponse>({
      mutationFn: deleteAllNotifications,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.notifications],
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const {
    mutate: deleteSingleNotificationMutation,
    isPending: isDeletingSingle,
  } = useMutation<DefaultSuccessResponse, ErrorResponse, string>({
    mutationFn: (notificationId: string) =>
      deleteSingleNotification(notificationId),
    onSuccess: () => {
      toast.success("Notification deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.notifications],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              {isDeletingAll ? (
                <LoadingSpinner size="md" />
              ) : (
                <IoSettingsOutline className="w-4" />
              )}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={() => deleteNotificationsMutation()}>
                  Delete all notifications
                </a>
              </li>
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}
        {notifications?.map((notification) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex justify-between items-center p-4">
              <div className="flex gap-2">
                {notification.type === "follow" && (
                  <FaUser className="w-7 h-7 text-primary" />
                )}
                {notification.type === "like" && (
                  <FaHeart className="w-7 h-7 text-red-500" />
                )}
                <Link to={`/profile/${notification.from?.userName}`}>
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img
                        src={
                          notification.from?.profileImg ||
                          "/avatar-placeholder.png"
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <span className="font-bold">
                      @{notification.from?.userName}
                    </span>{" "}
                    {notification.type === "follow"
                      ? "followed you"
                      : "liked your post"}
                  </div>
                </Link>
              </div>
              {isDeletingSingle ? (
                <LoadingSpinner size="sm" />
              ) : (
                <FaTrash
                  onClick={() =>
                    deleteSingleNotificationMutation(notification._id)
                  }
                  className=" text-red-500 cursor-pointer"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default Notification;
