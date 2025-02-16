import { IUser } from "@/types/structs";
import { create } from "zustand";

interface Actions {
  update: (newData: Partial<IUser>) => void;
  reset: () => void;
}

type State = { user: IUser }

type Store = Partial<State> & Actions;

const useUserStore = create<Store>((set) => ({
  update: (newData: Partial<IUser>) => set((state) => ({ user: state.user, ...newData })),
  reset: () => set({}),
}));

export default useUserStore;