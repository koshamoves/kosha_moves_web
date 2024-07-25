import { toast } from "@/components/toast/use-toast";
import { CacheKey, SUCCESS_MESSAGE } from "@/constants/enums";
import { Routes } from "@/core/routing";
import { updateUserDetails } from "@/firebase/firestore";
import { getFirebaseErrorMessage } from "@/lib/helpers/getErrorMessage";
import { queryClient } from "@/lib/query";
import { wait } from "@/lib/utils";
import useUserStore from "@/stores/user.store";
import { Booking } from "@/types/structs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useUpdateUserDetails = () => {
  const {updateUser} =  useUserStore((state) => state);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = (name?: string, phoneNumber?: string) => {
    setLoading(true);
    setError(null);

    updateUserDetails(name, phoneNumber)
      .then(() => {
            updateUser({fullName: name, phoneNumber})
        toast({
          description: SUCCESS_MESSAGE.PROFILE_UPDATE,
          variant: "success",
        });
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
    updateProfile,
    loading,
    error,
  };
};
