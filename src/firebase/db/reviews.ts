import {
  collection,
  getDocs,
  where,
  query,
  addDoc,
  limit,
} from "firebase/firestore";
import {} from "firebase/database";
import { FIREBASE_COLLECTIONS } from "@/constants/enums";
import { Review } from "@/types/structs";
import { db } from ".";
import { getAuth } from "firebase/auth";
import useUserStore from "@/stores/user.store";

export const getCompanyReview = async (companyId: string) => {
  try {
    const q = query(
      collection(db, FIREBASE_COLLECTIONS.REVIEWS),
      where("companyId", "==", companyId)
    );
    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Partial<Review>)
    );
    return reviews;
  } catch (err) {
    throw err;
  }
};

export const addCustomerReview = async (
  payload: Pick<Review, "companyId" | "comment" | "rating">
) => {
  try {
    const user = useUserStore.getState().user;
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    const res = await addDoc(collection(db, FIREBASE_COLLECTIONS.REVIEWS), {
      ...payload,
      modifiedDate: null,
      parentId: null,
      isVendorReply: false,
      reviewDate: new Date().getTime(),
      userId,
      userName: user?.fullName || user?.displayName || "",
    });
    return res;
  } catch (err) {
    throw err;
  }
};

export const canWriteCompanyReview = async (companyId: string) => {
  try {
    const user = useUserStore.getState().user;
    const q = query(
      collection(db, FIREBASE_COLLECTIONS.REVIEWS),
      where("companyId", "==", companyId),
      where("userId", "==", user?.uid),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (err) {
    throw err;
  }
};
