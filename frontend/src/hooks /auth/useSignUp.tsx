import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  ErrorResponse,
  RegisterCredentials,
  SuccessResponse,
} from "../../models/type/auth";
import { saveUser } from "../../utils/user.storage";
import { QUERY_KEY } from "../../utils/constants";

async function signUp(formData: RegisterCredentials): Promise<SuccessResponse> {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok || data.error)
      throw new Error(data.error || "Failed to create account  ");
    return data;
  } catch (err) {
    throw err as Error;
  }
}

type IUseSignUp = {
  signUpMutation: UseMutateFunction<
    SuccessResponse,
    ErrorResponse,
    RegisterCredentials,
    unknown
  >;

  isError: boolean;
  isPending: boolean;
  error: ErrorResponse | null;
};

export function useSignUp(): IUseSignUp {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    mutate: signUpMutation,
    isError,
    isPending,
    error,
  } = useMutation<SuccessResponse, ErrorResponse, RegisterCredentials, unknown>(
    {
      mutationFn: async (formData: RegisterCredentials) => signUp(formData),
      onSuccess: (data: SuccessResponse) => {
        toast.success(data.message || "Account Created Successfully");
        queryClient.setQueryData([QUERY_KEY.user], data);
        saveUser(data);
        navigate("/");
      },
      onError: (error: unknown) => {
        const err = "Ops.. Error on sign up. Try again!";
        toast.error((error as Error).message || err);
      },
    }
  );

  return {
    signUpMutation,
    isError,
    isPending,
    error,
  };
}
