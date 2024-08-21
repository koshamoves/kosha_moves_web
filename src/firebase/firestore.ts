import { getAuth } from "firebase/auth";
import {
  collection,
  getFirestore,
  addDoc,
  getDocs,
  where,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import firebaseApp from "./config";
import { FIREBASE_COLLECTIONS } from "@/constants/enums";
import { Booking, Quote, Voucher } from "@/types/structs";
import { toast } from "@/components/toast/use-toast";
import { getFirebaseErrorMessage } from "@/lib/helpers/getErrorMessage";
import type { FirebaseError } from "firebase/app";
import { safeParseDate } from "@/lib/utils";
import { getStorage } from "firebase/storage";

export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export const addToBookings = async (payload: Booking) => {
  try {
    const q = query(
      collection(db, FIREBASE_COLLECTIONS.BOOKINGS),
      where("bookingId", "==", payload.bookingId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("Document with the same bookingId already exists.");
    }

    const res = await addDoc(collection(db, FIREBASE_COLLECTIONS.BOOKINGS), {
      ...payload,
      bookingDate: new Date().getTime(),
    });
    return res;
  } catch (err) {
    throw err;
  }
};

export const getBookings = async (inputDate: Date) => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    const date = new Date(inputDate);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const q = query(
      collection(db, FIREBASE_COLLECTIONS.BOOKINGS),
      where("bookingDate", ">=", startOfDay.getTime()),
      where("bookingDate", "<=", endOfDay.getTime()),
      where("clientId", "==", userId),
      where("requestType", "in", ["RegularMove", "LabourOnly"]), // Get only move and labour booking for now
      orderBy("bookingDate", "desc")
    );

    const querySnapshot = await getDocs(q);

    const bookings = querySnapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Partial<Booking>)
      )
      .filter((booking) => booking.quote);
    return bookings;
  } catch (err) {
    throw err;
  }
};

export const updateQuote = async (bookingId: string, quote: Quote) => {
  try {
    const userId = getAuth().currentUser?.uid;
    const querySnapshot = await getDocs(
      query(
        collection(db, FIREBASE_COLLECTIONS.BOOKINGS),
        where("bookingId", "==", bookingId),
        where("clientId", "==", userId)
      )
    );
    if (querySnapshot.empty)
      throw new Error("Booking not found", { cause: 404 });
    const docRef = doc(
      db,
      FIREBASE_COLLECTIONS.BOOKINGS,
      querySnapshot.docs[0].id
    );
    await updateDoc(docRef, {
      quote,
    });
    return quote;
  } catch (err) {
    toast({
      title: "Oops!",
      description:
        err instanceof Error && err.cause === 404
          ? err.message || err.name
          : getFirebaseErrorMessage(err as FirebaseError),
      variant: "destructive",
    });
    throw err;
  }
};

export const updateBooking = async (bookingId: string, booking: Booking) => {
  try {
    const userId = getAuth().currentUser?.uid;
    const querySnapshot = await getDocs(
      query(
        collection(db, FIREBASE_COLLECTIONS.BOOKINGS),
        where("bookingId", "==", bookingId),
        where("clientId", "==", userId)
      )
    );
    if (querySnapshot.empty)
      throw new Error("Booking not found", { cause: 404 });
    const docRef = doc(
      db,
      FIREBASE_COLLECTIONS.BOOKINGS,
      querySnapshot.docs[0].id
    );
    await updateDoc(docRef, {
      ...booking,
      bookingId,
    });
    return booking;
  } catch (err) {
    toast({
      title: "Oops!",
      description:
        err instanceof Error && err.cause === 404
          ? err.message || err.name
          : getFirebaseErrorMessage(err as FirebaseError),
      variant: "destructive",
    });
    throw err;
  }
};

export const deleteBooking = async (bookingId: string) => {
  try {
    const userId = getAuth().currentUser?.uid;
    const querySnapshot = await getDocs(
      query(
        collection(db, FIREBASE_COLLECTIONS.BOOKINGS),
        where("bookingId", "==", bookingId),
        where("clientId", "==", userId)
      )
    );
    if (querySnapshot.empty)
      throw new Error("Booking not found", { cause: 404 });
    const docRef = doc(
      db,
      FIREBASE_COLLECTIONS.BOOKINGS,
      querySnapshot.docs[0].id
    );
    await deleteDoc(docRef);
  } catch (err) {
    toast({
      title: "Oops!",
      description:
        err instanceof Error && err.cause === 404
          ? err.message || err.name
          : getFirebaseErrorMessage(err as FirebaseError),
      variant: "destructive",
    });
    throw err;
  }
};

export const getVoucher = async (code: string) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, FIREBASE_COLLECTIONS.VOUCHERS),
        where("code", "==", code)
      )
    );
    if (querySnapshot.empty)
      throw new Error("Voucher not found", { cause: 404 });
    const vouchers = querySnapshot.docs.filter((item) => {
      const voucher = item.data() as Voucher,
        startDate = safeParseDate(voucher.startDate)?.getTime(),
        endDate = safeParseDate(voucher.endDate)?.getTime(),
        currentDate = new Date().getTime(),
        valid = currentDate > startDate! && currentDate < endDate!;
      return valid;
    });
    if (vouchers.length === 0)
      throw new Error("Voucher not found", { cause: 404 });
    return vouchers[0].data() as Voucher;
  } catch (err) {
    toast({
      title: "Oops!",
      description:
        err instanceof Error && err.cause === 404
          ? err.message || err.name
          : getFirebaseErrorMessage(err as FirebaseError),
      variant: "destructive",
    });
    throw err;
  }
};

export const cancelBooking = async (bookingId: string) => {
  try {
    const userId = getAuth().currentUser?.uid;
    const querySnapshot = await getDocs(
      query(
        collection(db, FIREBASE_COLLECTIONS.BOOKINGS),
        where("bookingId", "==", bookingId),
        where("clientId", "==", userId)
      )
    );
    if (querySnapshot.empty)
      throw new Error("Booking not found", { cause: 404 });
    const docRef = doc(
      db,
      FIREBASE_COLLECTIONS.BOOKINGS,
      querySnapshot.docs[0].id
    );
    await updateDoc(docRef, {
      status: "Cancelled",
    });
  } catch (err) {
    toast({
      title: "Oops!",
      description:
        err instanceof Error && err.cause === 404
          ? err.message || err.name
          : getFirebaseErrorMessage(err as FirebaseError),
      variant: "destructive",
    });
    throw err;
  }
};

export const updateUserDetails = async (
  name?: string,
  phoneNumber?: string
) => {
  try {
    const userId = getAuth().currentUser?.uid;
    const userDocRef = doc(db, FIREBASE_COLLECTIONS.USERS, userId ?? "");
    await updateDoc(userDocRef, {
      fullName: name,
      phoneNumber: phoneNumber,
    });
  } catch (err) {
    toast({
      title: "Oops!",
      description: getFirebaseErrorMessage(err as FirebaseError),
      variant: "destructive",
    });
    throw err;
  }
};

// export const uploadFileToFirebase = async (file: File, path: string): Promise<string> => {
//   const storageRef = ref(storage, path);
//   await uploadBytes(storageRef, file);
//   return getDownloadURL(storageRef);
// }
