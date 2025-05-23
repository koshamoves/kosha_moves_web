import { SearchRequestDto } from "@/types/dtos";
import { Endpoints } from "../endpoints";
import { Quote } from "@/types/structs";
import firebaseApp from "@/firebase/config";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions(firebaseApp);

const _getQuote = httpsCallable(functions, Endpoints.GET_QUOTE);
const _getQuotes = httpsCallable(functions, Endpoints.GET_QUOTES);

export const getQuote = async (payload: Partial<SearchRequestDto>): Promise<Quote> => {
  return (await _getQuote({ searchRequest: JSON.stringify(payload) })).data as Quote;
};

export const getQuotes = async (payload: Partial<SearchRequestDto>): Promise<Quote[]> => {
  return (await _getQuotes({ searchRequest: JSON.stringify(payload) })).data as Quote[];
};