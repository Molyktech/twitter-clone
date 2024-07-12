import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  ErrorResponse,
  LoginCredentials,
  SuccessResponse,
} from "../../models/type/auth";
import { saveUser } from "../../utils/user.storage";

async function signIn(formValues: LoginCredentials): Promise<SuccessResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formValues),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data;
}

type IUseSignIn = {
  signInMutation: UseMutateFunction<
    SuccessResponse,
    ErrorResponse,
    LoginCredentials,
    unknown
  >;
  isError: boolean;
  isPending: boolean;
  error: ErrorResponse | null;
};

export function useSignIn(): IUseSignIn {
  const navigate = useNavigate();

  const {
    mutate: signInMutation,
    isError,
    isPending,
    error,
  } = useMutation<SuccessResponse, ErrorResponse, LoginCredentials, unknown>({
    mutationFn: (formData: LoginCredentials) => signIn(formData),
    onSuccess: (data: SuccessResponse) => {
      toast.success(data.message || "Login Successful");
      saveUser(data);
      navigate("/");
    },
    onError: (error: ErrorResponse) => {
      const err = "Ops.. Error on sign up. Try again!";
      toast.error(error.message || err);
    },
  });

  return {
    signInMutation,
    isError,
    isPending,
    error,
  };
}
