import { Booking, RequestType } from "@/types/structs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import appConfig from "../../env.config";
import { createSelectorFunctions } from "auto-zustand-selectors-hook";
import useBookMoveStore from "./book-move.store";
import useHireLabourStore from "./hire-labour.store";
import { bookMoveReverseFactory } from "@/core/models/bookMoveFactory";
import { hireLabourReverseFactory } from "@/core/models/hireLabourFactory";

interface State {
  selectedBooking: Partial<Booking> | null;
  setSelectedBooking: (booking: Partial<Booking> | null) => void;
}

const whiteList: (keyof State)[] = ["selectedBooking"];

const useBookingStore = createSelectorFunctions(
  create<State>()(
    persist(
      immer<State>((set) => ({
        selectedBooking: null,
        setSelectedBooking: (booking) => {
          const updateBookMove = useBookMoveStore.getState().update;
          const updateHireLabour = useHireLabourStore.getState().update;
          set((state) => {
            state.selectedBooking = booking;
            if (booking?.requestType === RequestType.RegularMove) {
              updateBookMove(bookMoveReverseFactory(booking));
            } else if (booking?.requestType === RequestType.LabourOnly) {
              updateHireLabour(hireLabourReverseFactory(booking));
            }
          });
        },
      })),
      {
        name: "96yo_41vhxp840s9bxqv6",
        partialize: (state) => {
          const currentState = Object.fromEntries(
            Object.entries(state).filter(([key]: (keyof State)[]) =>
              whiteList.includes(key)
            )
          );
          appConfig.env === "DEV" && console.log("BOOKING STORE: ", state);
          return currentState;
        },
      }
    )
  )
);

export default useBookingStore;
