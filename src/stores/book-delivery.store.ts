import { StorageKeys } from "@/constants/enums";
import { OptionalExcept } from "@/lib/utils";
import { BookDelivery } from "@/types/structs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface Actions {
  update: (newData: Partial<BookDelivery>) => void;
  updateField: <K extends keyof BookDelivery>(
    name: K,
    value: BookDelivery[K]
  ) => void;
  removeStop: (index: number) => void;
  removeImage: (index: number, type?: ImageKind) => void;
  reset: () => void;
}

type Store = OptionalExcept<BookDelivery, "PUDStops" | "images" | "pictures" | "receipts" | "services" | "stops"> & Actions;

export enum ImageKind {
  Image = "images",
  Picture = "pictures",
  Receipt = "receipts"
}

const init = {
  PUDStops: [],
  images: [],
  pictures: [],
  receipts: [],
  services: [],
  stops: [],
};

const useBookDeliveryStore = create<Store>()(
  persist(
    immer<Store>((set) => ({
      ...init,

      update: (newData: Partial<BookDelivery>) => set(state => ({ ...state, ...newData })),

      updateField: (name, value) => set(state => {
        if (name.startsWith("stops")) {
          const stopIndex = parseInt(name.split(".")[1]);
          const updatedStops = [...state.stops];

          updatedStops[stopIndex] = { ...updatedStops[stopIndex], ...(value as {}) };
          return { ...state, stops: updatedStops };
        }

        return { ...state, [name]: value };
      }),

      removeStop: (index: number) => set(state => ({
        ...state,
        stops: state.stops.filter((_, i) => i !== index),
        PUDStops: state.PUDStops?.filter((_, i) => i !== index)
      })),

      removeImage: (index: number, type: ImageKind = ImageKind.Image) => set(state => {
        const newImages = state[type]?.filter((_, i) => i !== index) ?? [];
        return { ...state, [type]: newImages };
      }),

      reset: () => set({ ...init }),

    })),
    {
      name: StorageKeys.BOOK_DELIVERY_FORM,
    }
  ),
);

export default useBookDeliveryStore;
