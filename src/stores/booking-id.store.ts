import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { StorageKeys } from "@/constants/enums";
import { generateBookingId } from "@/lib/helpers/generateBookingId";

// FIXME: why is this separate from booking.store.ts?
interface Action {
    reset: () => void;
}

type Data = { id: string }

type Store = Data & Action;

const useBookingIdStore = create<Store>()(
    persist(
        immer<Store>((set) => ({
            id: generateBookingId(),
            reset: () => set({ id: generateBookingId() }),
        })),
        {
            name: StorageKeys.BOOKING_ID,
        }
    )
);

export default useBookingIdStore
