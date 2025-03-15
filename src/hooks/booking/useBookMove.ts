import { toast } from "@/components/toast/use-toast";
import { CacheKey, ErrorMessage, SUCCESS_MESSAGE } from "@/constants/enums";
import { bookMove as bookMoveData } from "@/core/api/booking";
import { MoveRequestDto } from "@/types/dtos";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useValidRoute } from "../useValidRoute";
import { Routes } from "@/core/routing";
import { useState } from "react";
import useShowQuotes from "@/stores/show-quotes.store";
import { queryClient } from "@/lib/query";
import { wait } from "@/lib/utils";
import useBookMoveStore from "@/stores/book-move.store";
import useHireLabourStore from "@/stores/hire-labour.store";
import { useRouter } from "next/navigation";

export const useBookMove = (
  useMutationOptions: Omit<UseMutationOptions<any, any, Partial<MoveRequestDto>>, "mutationFn"> = {}
) => {
  const { isValidRoute: isHireLabourRoute } = useValidRoute(Routes.sequence.hireLabour);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  const { reset } = useShowQuotes.getState();
  const { reset: resetBookMove } = useBookMoveStore.getState();
  const { reset: resetHireLabour } = useHireLabourStore.getState();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const methods = useMutation<any, any, Partial<MoveRequestDto>>({
    mutationFn: (props) => bookMoveData(props),
    ...useMutationOptions,
  });

  const _useBookMove = (payload: Partial<MoveRequestDto>) =>
    methods
      .mutateAsync(payload)
      .then((res: any) => {
        queryClient.invalidateQueries({ queryKey: [CacheKey.BOOKINGS_STATE] });
        reset();
        resetHireLabour();
        resetBookMove();
        localStorage.clear();

        toast({
          description: SUCCESS_MESSAGE.BOOKINGS_COMPLETE,
          variant: "success",
        });

        wait(0).then(() => router.push(Routes.bookings));
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
    bookMove: _useBookMove,
  };
};
