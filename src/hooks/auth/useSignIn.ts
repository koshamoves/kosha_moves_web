import { toast } from "@/components/toast/use-toast";
import { Routes } from "@/core/routing";
import { signIn, signInWithGoogle as signInWithPopup } from "@/firebase/auth";
import { getFirebaseErrorMessage } from "@/lib/helpers/getErrorMessage";
import useUserStore from "@/stores/user.store";
import { SignInDto } from "@/types/dtos";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export const useSignIn = () => {
  const updateUser = useUserStore((state) => state.update);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const signInWithEmail = (payload: SignInDto) => {
    setLoading(true);
    setError(null);

    signIn(payload)
      .then((res) => {
        updateUser(res);
        router.push(returnUrl ?? Routes.root);
      })
      .catch((err) => {
        setError(err);
        toast({
          title: "Oops!",
          description: getFirebaseErrorMessage(err),
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return {
    signInWithEmail,
    loading,
    error,
  };
};

export const useSignInWithGoogle = () => {
  const updateUser = useUserStore((state) => state.update);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const signInWithGoogle = () => {
    setLoading(true);
    setError(null);

    signInWithPopup()
      .then((res) => {
        updateUser(res);
        router.push(returnUrl ?? Routes.root);
      })
      .catch((err) => {
        setError(err);
        toast({
          title: "Oops!",
          description: getFirebaseErrorMessage(err),
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return {
    signInWithGoogle,
    loading,
    error,
  };
};

