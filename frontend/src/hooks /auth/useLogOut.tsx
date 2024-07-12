import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ErrorResponse } from "../../models/type/auth";
import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { removeUser } from "../../utils/user.storage";

type IUseSignOut = UseMutateFunction<SuccessResponse, ErrorResponse>;

type SuccessResponse = {
  message: string;
};

async function signOut(): Promise<SuccessResponse> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok || data.error) throw new Error(data.error);
    return data;
  } catch (err) {
    throw err as Error;
  }
}

export function useSignOut(): IUseSignOut {
  const navigate = useNavigate();

  const { mutate: signOutMutation } = useMutation<
    SuccessResponse,
    ErrorResponse
  >({
    mutationFn: () => signOut(),
    onSuccess: (data: SuccessResponse) => {
      toast.success(data.message || "Logout Successful");
      removeUser();
      navigate("/login");
    },
    onError: (error: ErrorResponse) => {
      const err = "Ops.. Error on sign out. Try again!";
      toast.error(error.message || err);
    },
  });

  return signOutMutation;
}
