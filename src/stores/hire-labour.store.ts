import { StorageKeys } from "@/constants/enums";
import { OptionalExcept } from "@/lib/utils";
import { HireLabour } from "@/types/structs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface Actions {
  update: (newData: Partial<HireLabour>) => void;
  updateField: <K extends keyof HireLabour>(
    fieldName: K,
    newValue: HireLabour[K]
  ) => void;
  removeImage: (index: number) => void;
  reset: () => void;
}

type Store = OptionalExcept<HireLabour, "images" | "services" | "tempImages"> & Actions;


const useHireLabourStore = create<Store>()(
  persist(
    immer<Store>((set) => ({
      images: [],
      services: [],
      tempImages: [],

      update: (newData: Partial<HireLabour>) => set((state) => ({ ...state, ...newData })),
      updateField: (name, value) => set((state) => ({ ...state, [name]: value })),

      // TODO: does this even work? 
      removeImage: (index) => set((state) => {
        if (state?.images) return state;

        const newImages = state.images.filter((_, i) => i !== index);
        return { ...state, images: newImages };
      }),
      reset: () => set({}),
    })),
    {
      name: StorageKeys.HIRE_LABOUR_FORM,
    }
  )
);

export default useHireLabourStore;
