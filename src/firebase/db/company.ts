import { getDoc, doc } from "firebase/firestore";
import { FIREBASE_COLLECTIONS } from "@/constants/enums";
import { db } from ".";
import { Company } from "@/types/structs";

export const getCompany = async (id: string) => {
  try {
    const querySnapshot = await getDoc(
      doc(db, FIREBASE_COLLECTIONS.COMPANIES, id)
    );
    if (!querySnapshot.exists())
      throw new Error("Company not found", { cause: 404 });
    const company = {
      id: querySnapshot.id,
      ...querySnapshot.data(),
    } as Partial<Company>;
    return company;
  } catch (err) {
    throw err;
  }
};
