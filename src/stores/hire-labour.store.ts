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
};

const useHireLabourStore = create<Store>((set) => ({
  formData: initialState,
  update: (newData) =>
    set((state) => {
      const updatedFormData = { ...state.formData, ...newData };
      return { formData: updatedFormData };
    }),
  updateField: (fieldName, newValue) =>
    set((state) => ({
      formData: { ...state.formData, [fieldName]: newValue },
    })),
  removeImage: (index) =>
    set((state) => {
      const newImages = state.formData.images.filter((_, i) => i !== index);
      return {
        formData: { ...state.formData, images: newImages },
      };
    }),
  reset: () => set({ formData: initialState }),
}));

export default useHireLabourStore;
