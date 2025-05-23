import { BookMove } from "@/types/structs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import appConfig from "../../env.config";
import { fileToString } from "@/lib/helpers/file.helpers";
import { StorageKeys } from "@/constants/enums";

interface Store {
  formData: BookMove;
  update: (newData: Partial<BookMove>) => void;
  updateField: <K extends keyof BookMove>(
    fieldName: K,
    newValue: BookMove[K]
  ) => void;
  removeStop: (index: number) => void;
  removeImage: (index: number) => void;
  reset: () => void;
}

// const whiteList: (keyof Store)[] = ["formData"];
const whiteList: (keyof Store)[] = [];

const initialState: BookMove = {
  moveDate: undefined as unknown as Date,
  time: "",
  pickUpLocation: {
    location: "",
    apartmentNumber: "",
    googlePlaceId: "",
  },
  stops: [],
  finalDestination: {
    location: "",
    apartmentNumber: "",
    googlePlaceId: "",
  },
  PUDFinalDestination: {
    elevatorAccess: "",
    flightOfStairs: "0",
    // buildingType: "Condo",
    buildingType: "",
  },
  PUDPickUpLocation: {
    elevatorAccess: "",
    flightOfStairs: "0",
    // buildingType: "Condo",
    buildingType: "",
  },
  PUDStops: [],
  majorAppliances: "",
  workOutEquipment: "",
  pianos: "",
  hotTubs: "",
  poolTables: "",
  numberOfBoxes: "",
  instructions: "",
  images: [],
  services: [],
  tempImages: [],
  bookingId: "",
};

const useBookMoveStore = create<Store>()(
  persist(
    immer<Store>((set) => ({
      formData: initialState,
      updateLSFormData: () => {
        set((state) => {
          localStorage.setItem(
            StorageKeys.FORM_DATA,
            JSON.stringify(state.formData)
          );
          return { ...state };
        });
      },
      update: (newData) => {
        set((state) => ({
          formData: { ...state.formData, ...newData },
        }));
        set((state) => {
          localStorage.setItem(
            StorageKeys.FORM_DATA,
            JSON.stringify(state.formData)
          );
          return { ...state };
        });
      },
      updateField: (fieldName, newValue) => {
        set((state) => {
          if (fieldName.startsWith("stops")) {
            const stopIndex = parseInt(fieldName.split(".")[1]);
            const updatedStops = [...state.formData.stops];
            const updatedStop = {
              ...updatedStops[stopIndex],
              ...(newValue as {}),
            };
            updatedStops[stopIndex] = updatedStop;
            return {
              formData: { ...state.formData, stops: updatedStops },
            };
          }
          return {
            formData: { ...state.formData, [fieldName]: newValue },
          };
        });
        set((state) => {
          localStorage.setItem(
            StorageKeys.FORM_DATA,
            JSON.stringify(state.formData)
          );
          return { ...state };
        });
      },
      removeStop: (index) => {
        set((state) => ({
          formData: {
            ...state.formData,
            stops: state.formData.stops.filter((_, i) => i !== index),
            PUDStops: state.formData.PUDStops?.filter((_, i) => i !== index),
          },
        }));
        set((state) => {
          localStorage.setItem(
            StorageKeys.FORM_DATA,
            JSON.stringify(state.formData)
          );
          return { ...state };
        });
      },
      removeImage: (index) => {
        set((state) => {
          const newImages = state?.formData?.tempImages!.filter(
            (_, i) => i !== index
          );
          return {
            formData: { ...state.formData, tempImages: newImages },
          };
        });
        set((state) => {
          localStorage.setItem(
            StorageKeys.FORM_DATA,
            JSON.stringify(state.formData)
          );
          return { ...state };
        });
      },
      reset: () => {
        set({ formData: initialState });
        set((state) => {
          localStorage.setItem(
            StorageKeys.FORM_DATA,
            JSON.stringify(state.formData)
          );
          return { ...state };
        });
      },
    })),
    {
      name: "bmo5ibreyw7a0zt2h67_3",
      partialize: (state) => {
        const currentState = Object.fromEntries(
          Object.entries(state).filter(([key]: (keyof Store)[]) =>
            whiteList.includes(key)
          )
        );
        appConfig.env === "DEV" && console.log("BOOK MOVE STORE: ", state);
        return currentState;
      },
    }
  )
);

export default useBookMoveStore;
