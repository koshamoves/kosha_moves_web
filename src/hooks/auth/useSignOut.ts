import { toast } from "@/components/toast/use-toast";
import { signOutUser } from "@/firebase/auth"
import { getFirebaseErrorMessage } from "@/lib/helpers/getErrorMessage";
import { wait } from "@/lib/utils";
import useUserStore from "@/stores/user.store";
import { useState } from "react";

export const useSignOut = () => {
      const { update: updateUser, reset: resetUser } = useUserStore((state) => state);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const signOut = () => {
            setLoading(true);
            setError(null);

            signOutUser()
                  .then(() => {
                        resetUser();
                        localStorage.clear();
                        wait(1000).then(() => window.location.reload())
                  })
                  .catch((err) => {
                        setError(err);
                        toast({
                              title: "Oops!",
                              description: getFirebaseErrorMessage(err),
                              variant: "destructive"
                        })
                  })
                  .finally(() => {
                        wait(2000).then(() => setLoading(false));
                  })
      }
      return {
            signOut,
            loading,
            error
      }
} 