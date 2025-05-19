import { toast } from "@/components/toast/use-toast";
import { CacheKey, ErrorMessage, SUCCESS_MESSAGE } from "@/constants/enums";
import { updateMove as updateMoveData } from "@/core/api/booking";
import { MoveUpdateDto } from "@/types/dtos";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useValidRoute } from "../useValidRoute";
import { Routes } from "@/core/routing";
import { useState } from "react";
import useShowQuotes from "@/stores/show-quotes.store";
import { useRouter } from "next/navigation";
import { queryClient } from "@/lib/query";
import { wait } from "@/lib/utils";
import useBookMoveStore from "@/stores/book-move.store";
import useBookingStore from "@/stores/booking.store";
import useHireLabourStore from "@/stores/hire-labour.store";

export const useUpdateMove = (
  useMutationOptions: Omit<UseMutationOptions<any, any, Partial<MoveUpdateDto>>, "mutationFn"> = {}
) => {
  const { isValidRoute: isHireLabourRoute } = useValidRoute(Routes.sequence.hireLabour);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const setSelectedBooking = useBookingStore.use.setSelectedBooking();
  const { reset } = useShowQuotes.getState();
  const { reset: resetBookMove } = useBookMoveStore.getState();
  const { reset: resetHireLabour } = useHireLabourStore.getState();

  const methods = useMutation<any, any, Partial<MoveUpdateDto>>({
    mutationFn: (props) => updateMoveData(props),
    ...useMutationOptions,
  });

  const _useUpdateMove = (payload: Partial<MoveUpdateDto>) =>
    methods
      .mutateAsync(payload)
      .then((res: any) => {
        queryClient.invalidateQueries({ queryKey: [CacheKey.BOOKINGS_STATE] });
        localStorage.clear();
        setSelectedBooking(null);
        reset();
        resetHireLabour();
        resetBookMove();
        // TODO: do we also want to make use of the searchParam in /bookings here? 

        toast({
          description: SUCCESS_MESSAGE.BOOKING_UPDATED,
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
    updateMove: _useUpdateMove,
  };
};
