import { StorageKeys } from "@/constants/enums";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Quote } from "@/types/structs";
import { OptionalExcept } from "@/lib/utils";

interface Actions {
    updateField: <K extends keyof Quote>(name: K, value: Quote[K]) => void;
    replace: (newData: Quote) => void;
};

type Store = OptionalExcept<Quote, "equippedToMove"> & Actions;

const useQuoteDetailsStore = create<Store>()(
    persist(
        immer<Store>((set) => ({
            equippedToMove: [],

            updateField: (name, value) => {
                set((state) => ({ ...state, [name]: value }));
            },
            replace: (newData) => set({ ...newData })
        })),
        {
            name: StorageKeys.QUOTE_DETAIL
        }
    )
)

export default useQuoteDetailsStore;