import { StorageKeys } from '@/constants/enums';
import { Quote } from '@/types/structs';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Actions {
  setShowQuote: (value: boolean) => void;
  setQuotesResult: (quotes: Quote[] | undefined) => void;
  reset: () => void;
}

type State = {
  showQuote: boolean,
  quotesResult: Quote[]
}

type Store = State & Actions;

const init: State = { showQuote: false, quotesResult: [] };

const useShowQuotes = create<Store>()(
  persist(
    (set) => ({
      ...init,
      setShowQuote: (value: boolean) => set({ showQuote: value }),
      setQuotesResult: (quotes: Quote[] | undefined) => set({ quotesResult: quotes || [] }),
      reset: () => set({ ...init })
    }),
    {
      name: StorageKeys.QUOTES_RESULT,
      partialize: (state) => ({ quotesResult: state.quotesResult })
    }
  )
);



export default useShowQuotes;
