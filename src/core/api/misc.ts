import { ApiResponse } from "@/types/structs";
import { GoogleAutoCompleteDto } from "@/types/dtos";
import { Endpoints } from "../endpoints";
import firebaseApp from "@/firebase/config";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions(firebaseApp);
const getGooglePlaceAutoComplete = httpsCallable(functions, Endpoints.GET_GOOGLE_PLACE_AUTO_COMPLETE);

export const googleAutoComplete = async (payload: GoogleAutoCompleteDto): Promise<ApiResponse<any>> => {
  const res = await getGooglePlaceAutoComplete({ data: payload });
  return res.data as any;
};

