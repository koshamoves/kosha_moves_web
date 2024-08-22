import { toast } from "@/components/toast/use-toast";
import { ErrorMessage, StorageKeys } from "@/constants/enums";
import { getQuotes as getQuotesData } from "@/core/api/quote";
import bookMoveStore from "@/stores/book-move.store";
import useShowQuotes from "@/stores/show-quotes.store";
import { BookMoveDto } from "@/types/dtos";
import { Quote } from "@/types/structs";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useValidRoute } from "../useValidRoute";
import { Routes } from "@/core/routing";
import hireLabourStore from "@/stores/hire-labour.store";

export const useGetQuotes = (
  useMutationOptions: Omit<
    UseMutationOptions<any, any, Partial<BookMoveDto>>,
    "mutationFn"
  > = {}
) => {
  const { isValidRoute: isHireLabourRoute } = useValidRoute(
    Routes.sequence.hireLabour
  );
  const setQuotesResult = useShowQuotes((state) => state.setQuotesResult);
  const methods = useMutation<any, any, Partial<BookMoveDto>>({
    mutationFn: (props) => getQuotesData(props),
    ...useMutationOptions,
  });

  const _useGetQuotes = (payload: Partial<BookMoveDto>) =>
    methods
      .mutateAsync(payload)
      .then((res) => {
        const { formData } = bookMoveStore.getState();
        const { formData: hireLabourFormData } = hireLabourStore.getState();
        if (isHireLabourRoute) {
          localStorage.setItem(
            StorageKeys.FORM_DATA,
            JSON.stringify(hireLabourFormData)
          );
          setQuotesResult(res.result as Array<Quote>);
        } else {
          localStorage.setItem(StorageKeys.FORM_DATA, JSON.stringify(formData));
          setQuotesResult(res.result as Array<Quote>);
        }
      })
      .catch(() => {
        toast({
          title: "Oops!",
          description: ErrorMessage.UNEXPECTED_ERROR, //TODO:add a proper function to handle error
          variant: "destructive",
        });
      });

  return {
    ...methods,
    getQuotes: _useGetQuotes,
  };
};
