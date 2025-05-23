import { StorageKeys } from "@/constants/enums";
import { HireLabour } from "@/types/structs";
import { create } from "zustand";

interface Store {
  formData: HireLabour;
  update: (newData: Partial<HireLabour>) => void;
  updateField: <K extends keyof HireLabour>(
    fieldName: K,
    newValue: HireLabour[K]
  ) => void;
  removeImage: (index: number) => void;
  reset: () => void;
}

const initialState: HireLabour = {
  date: undefined as unknown as Date,
  time: "",
  serviceLocation: "",
  googlePlaceId: "",
  apartmentNumber: "",
  elevatorAccess: "Yes",
  flightOfStairs: "0",
  buildingType: "Condo",
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
  bookingId: ""
};

const useHireLabourStore = create<Store>((set) => ({
  formData: initialState,
  update: (newData) => {
    set((state) => {
      const updatedFormData = { ...state.formData, ...newData };
      return { formData: updatedFormData };
    });
    set((state) => {
      localStorage.setItem(
        StorageKeys.FORM_DATA,
        JSON.stringify(state.formData)
      );
      return { ...state };
    });
  },
  updateField: (fieldName, newValue) => {
    set((state) => ({
      formData: { ...state.formData, [fieldName]: newValue },
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
      const newImages = state.formData.images.filter((_, i) => i !== index);
      return {
        formData: { ...state.formData, images: newImages },
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

export default useHireLabourStore;
