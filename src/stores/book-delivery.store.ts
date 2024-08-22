import { StorageKeys } from "@/constants/enums";
import { BookDelivery } from "@/types/structs";
import { create } from "zustand";

interface Store {
  formData: BookDelivery;
  update: (newData: Partial<BookDelivery>) => void;
  updateField: <K extends keyof BookDelivery>(
    fieldName: K,
    newValue: BookDelivery[K]
  ) => void;
  removeStop: (index: number) => void;
  removeImage: (
    index: number,
    type?: "images" | "pictures" | "receipts"
  ) => void;
  reset: () => void;
}

const initialState: BookDelivery = {
  deliveryDate: undefined as unknown as Date,
  time: "",
  pickUpLocation: {
    location: "",
    apartmentNumber: "",
  },
  deliveryLocation: {
    location: "",
    apartmentNumber: "",
  },
  stops: [],
  PUDFinalDestination: {
    buildingType: "",
    elevatorAccess: "",
    flightOfStairs: "",
  },
  PUDPickUpLocation: {
    buildingType: "",
    elevatorAccess: "",
    flightOfStairs: "",
  },
  PUDStops: [],
  images: [],
  pictures: [],
  receipts: [],
  instructions: "",
  services: [],
};

const useBookDeliveryStore = create<Store>((set) => ({
  formData: initialState,
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
  removeImage: (index, type: "images" | "pictures" | "receipts" = "images") => {
    set((state) => {
      const newImages =
        state.formData[type]?.filter((_, i) => i !== index) ?? [];
      return {
        formData: { ...state.formData, [type]: newImages },
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
}));

export default useBookDeliveryStore;
