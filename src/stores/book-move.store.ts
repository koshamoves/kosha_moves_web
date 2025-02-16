import { BookMove, Location } from "@/types/structs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { OptionalExcept } from "@/lib/utils";
import { StorageKeys } from "@/constants/enums";

interface Actions {
  update: (newData: Partial<BookMove>) => void;
  updateField: <K extends keyof BookMove>(
    name: K,
    value: BookMove[K],
  ) => void;
  removeStop: (index: number) => void;
  removeImage: (index: number) => void;
  reset: () => void;
}

type Store =
  & OptionalExcept<BookMove, "stops" | "services" | "images" | "tempImages">
  & Actions;

const useBookMoveStore = create<Store>()(
  persist(
    immer<Store>((set) => ({
      // empty arrays we can define and just keep empty
      stops: [],
      // PUDStops: [], // FIXME: this is optional in the schema for some reason
      services: [],
      images: [],
      tempImages: [],

      update: (newData) => set((state) => ({ ...state, ...newData })),

      updateField: (name, value) => {
        set((state) => {
          // FIXME: what about PUDStops?
          if (name.startsWith("stops")) {
            const stopIndex = parseInt(name.split(".")[1]);
            const stops = [...state.stops];

            const updated = {
              ...stops[stopIndex],
              ...value as Location,
            };

            stops[stopIndex] = updated;
            return { ...state, stops: stops };
          }

          return { ...state, [name]: value };
        });
      },
      removeStop: (index) => {
        set((state) => ({
          ...state,
          stops: state.stops.filter((_, i) => i !== index),
          PUDStops: state.PUDStops?.filter((_, i) => i !== index),
        }));
      },
      removeImage: (index) => {
        set((state) => {
          const filtered = state.tempImages!.filter((_, i) => i !== index);

          return { ...state, tempImages: filtered };
        });
      },
      reset: () => {
        set({ stops: [], PUDStops: [], services: [] });
      },
    })),
    {
      name: StorageKeys.BOOK_MOVE_FORM
    },
  ),
);

export default useBookMoveStore;
