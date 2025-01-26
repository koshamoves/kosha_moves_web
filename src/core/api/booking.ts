import { MoveRequestDto, MoveUpdateDto } from "@/types/dtos";
import { Endpoints } from "../endpoints";
import firebaseApp from "@/firebase/config";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions(firebaseApp);

const _bookMove = httpsCallable(functions, Endpoints.BOOK_MOVE);
const _updateMove = httpsCallable(functions, Endpoints.UPDATE_MOVE);

export const bookMove = async (payload: Partial<MoveRequestDto>): Promise<any> => {
  return (await _bookMove({ moveRequest: JSON.stringify(payload) })).data;
};

export const updateMove = async (payload: Partial<MoveUpdateDto>): Promise<any> => {
  return (await _updateMove({ moveRequest: JSON.stringify(payload) })).data;
};