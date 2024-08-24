import {
  useQuery,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { getCompanyReview, addCustomerReview } from "@/firebase/db/reviews";
import { CacheKey } from "@/constants/enums";
import { Review } from "@/types/structs";
import { toast } from "@/components/toast/use-toast";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { queryClient } from "@/lib/query";

export const useGetCompanyReviews = (companyId: string) => {
  return useQuery({
    queryKey: [CacheKey.REVIEW_STATE, companyId],
    queryFn: () => getCompanyReview(companyId),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useAddCustomerReview = (
  useMutationOptions: Omit<
    UseMutationOptions<
      unknown,
      unknown,
      Pick<Review, "companyId" | "comment" | "rating">
    >,
    "mutationFn"
  > = {}
) => {
  return useMutation<
    unknown,
    unknown,
    Pick<Review, "companyId" | "comment" | "rating">
  >({
    mutationFn: (newMessage) => addCustomerReview(newMessage),
    retry: false,
    ...useMutationOptions,
    onSuccess: (...args) => {
      useMutationOptions.onSuccess?.(...args);
      queryClient.invalidateQueries({ queryKey: [CacheKey.REVIEW_STATE] });
      toast({
        description: "Review added successfully",
        variant: "success",
      });
    },
    onError: (...args) => {
      useMutationOptions.onError?.(...args);
      toast({
        title: "Oops!",
        description: getErrorMessage(args[0]),
        variant: "destructive",
      });
    },
  });
};
