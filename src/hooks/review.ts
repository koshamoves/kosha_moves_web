import { useQuery, useMutation } from "@tanstack/react-query";
import { getCompanyReview, addCustomerReview } from "@/firebase/db/reviews";
import { CacheKey } from "@/constants/enums";
import { Review } from "@/types/structs";

export const useGetCompanyReviews = (companyId: string) => {
  return useQuery({
    queryKey: [CacheKey.REVIEW_STATE],
    queryFn: () => getCompanyReview(companyId),
    retry: false,
  });
};

export const useAddCustomerReview = () => {
  return useMutation<
    unknown,
    unknown,
    Pick<Review, "companyId" | "comment" | "rating">
  >({
    mutationFn: (newMessage) => addCustomerReview(newMessage),
    retry: false,
  });
};
