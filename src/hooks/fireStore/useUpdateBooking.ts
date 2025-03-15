import { toast } from "@/components/toast/use-toast";
import { CacheKey, SUCCESS_MESSAGE } from "@/constants/enums";
import { Routes } from "@/core/routing";
import { wait } from "@/lib/utils";
import useShowQuotes from "@/stores/show-quotes.store";
import { Booking } from "@/types/structs";
import { useRouter } from "next/navigation";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { updateBooking } from "@/firebase/firestore";
import useBookingStore from "@/stores/booking.store";
import { queryClient } from "@/lib/query";
import useBookMoveStore from "@/stores/book-move.store";
import useHireLabourStore from "@/stores/hire-labour.store";

type MutationInput = { bookingId: string; booking: Booking };

export const useUpdateBooking = (
  useMutationOptions: Omit<
    UseMutationOptions<Booking, unknown, MutationInput>,
    "mutationFn"
  > = {}
) => {
  const router = useRouter();
  const setSelectedBooking = useBookingStore.use.setSelectedBooking();
  const { reset } = useShowQuotes.getState();
  const { reset: resetBookMove } = useBookMoveStore.getState();
  const { reset: resetHireLabour } = useHireLabourStore.getState();
  return useMutation<Booking, unknown, MutationInput>({
    mutationFn: ({ bookingId, booking }) => updateBooking(bookingId, booking),
    retry: false,
    ...useMutationOptions,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: [CacheKey.BOOKINGS_STATE] });
      useMutationOptions.onSuccess?.(...args);
      localStorage.clear(); // FIXME: lol ok, what does this actually remove though?
      setSelectedBooking(null);
      reset();
      resetHireLabour();
      resetBookMove();
      toast({
        description: SUCCESS_MESSAGE.BOOKING_UPDATED,
        variant: "success",
      });
      wait(0).then(() => router.push(Routes.bookings));
    },
  });
};
