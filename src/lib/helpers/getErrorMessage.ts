import { FirebaseError } from "firebase/app";

const unexpectedErrorMessage =
  "An unexpected error occurred. Please try again.";

export class AppError extends Error {
  details: object;
  constructor(message: string, details: object = {}) {
    super(message);
    this.details = details;
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const getFirebaseErrorMessage = (error: FirebaseError) => {
  switch (error.message) {
    case "Firebase: Error (auth/email-already-in-use).":
      return "This email is already in use.";
    case "Firebase: Error (auth/invalid-email).":
      return "Invalid email address.";
    case "Firebase: Error (auth/weak-password).":
      return "The password is too weak.";
    case "Firebase: Error (auth/user-disabled).":
      return "This account has been disabled";
    case "Firebase: Error (auth/user-not-found).":
      return "Account doesn't exist";
    case "Firebase: Error (auth/wrong-password).":
      return "Wrong email/password";
    case "Firebase: Error (auth/invalid-credential).":
      return "Wrong email/password";
    default:
      return unexpectedErrorMessage;
  }
};

export const getErrorMessage = (err: unknown) =>
  err instanceof FirebaseError
    ? getFirebaseErrorMessage(err)
    : err instanceof AppError
    ? err.message
    : unexpectedErrorMessage;

