import { toast } from "@/components/toast/use-toast";
import { SUCCESS_MESSAGE } from "@/constants/enums";
import { updateUserDetails } from "@/firebase/firestore";
import { getFirebaseErrorMessage } from "@/lib/helpers/getErrorMessage";
import useUserStore from "@/stores/user.store";
import { useState } from "react";

export const useUpdateUserDetails = () => {
  const updateUser = useUserStore((state) => state.update);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = (name?: string, phoneNumber?: string) => {
    setLoading(true);
    setError(null);

    updateUserDetails(name, phoneNumber)
      .then(() => {
        updateUser({ fullName: name, phoneNumber })
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
