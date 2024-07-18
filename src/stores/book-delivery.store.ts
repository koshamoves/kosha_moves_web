import { BookDelivery } from "@/types/structs";
import { create } from "zustand";

interface Store {
  formData: BookDelivery;
  update: (newData: Partial<BookDelivery>) => void;
  updateField: <K extends keyof BookDelivery>(
    fieldName: K,
    newValue: BookDelivery[K]
  ) => void;
  removeImage: (
    index: number,
    type?: "images" | "pictures" | "receipts"
  ) => void;
}

const initialState: BookDelivery = {
  deliveryDate: new Date(),
  time: "",
  pickUpLocation: {
    location: "",
    apartmentNumber: "",
  },
  deliveryLocation: {
    location: "",
    apartmentNumber: "",
  },
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
  images: [],
  pictures: [],
  receipts: [],
  instructions: "",
};

const useBookDeliveryStore = create<Store>((set) => ({
  formData: initialState,
  update: (newData) =>
    set((state) => ({
      formData: { ...state.formData, ...newData },
    })),
  updateField: (fieldName, newValue) =>
    set((state) => ({
      formData: { ...state.formData, [fieldName]: newValue },
    })),
  removeImage: (index, type: "images" | "pictures" | "receipts" = "images") =>
    set((state) => {
      const newImages = state.formData[type]?.filter((_, i) => i !== index) ?? [];
      return {
        formData: { ...state.formData, [type]: newImages },
      };
    }),
}));

export default useBookDeliveryStore;
