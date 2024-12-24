import { BookMoveDto } from "@/types/dtos";
import { Endpoints } from "../endpoints";
import { ApiResponse, Quote } from "@/types/structs";
import firebaseApp from "@/firebase/config";
import { getFunctions, httpsCallable } from "firebase/functions";


const functions = getFunctions(firebaseApp);
const _getQuote = httpsCallable(functions, Endpoints.GET_QUOTE);
const _getQuotes = httpsCallable(functions, Endpoints.GET_QUOTES);


export const getQuote = async (payload: Partial<BookMoveDto>): Promise<any> => {
  const res = await _getQuote({ data: { searchRequest: JSON.stringify(payload) } });
  return res.data as any;
};

export const getQuotes = async (payload: Partial<BookMoveDto>): Promise<ApiResponse<Array<Quote>>> => {
  const res = await _getQuotes({ data: { searchRequest: JSON.stringify(payload) } });
  return res.data as ApiResponse<Array<Quote>>;
};

