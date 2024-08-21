import { CacheKey } from "@/constants/enums";
import { getCompany } from "@/firebase/db/company";
import { useQuery } from "@tanstack/react-query";

export const useGetCompany = (id: string) => {
  return useQuery({
    queryKey: [CacheKey.COMPANY_STATE, id],
    queryFn: () => getCompany(id),
    retry: false,
    refetchOnWindowFocus: false,
  });
};
