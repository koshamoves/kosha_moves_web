export enum EnvModes {
  DEV = "development",
  PROD = "production",
}

export enum QueryKeys {
  GET_QUOTES = "get-quotes",
}

export enum StorageKeys {
  QUOTES_RESULT = "quotes-result",
  QUOTE_DETAIL = "quote-detail",
  FORM_DATA = "form-data",
  IMAGES = "images",
}

export enum FIREBASE_COLLECTIONS {
  USERS = "users",
  BOOKINGS = "bookings",
  CHATS = "chats",
  CHAT_MESSAGES = "chat_messages",
  VOUCHERS = "vouchers",
  REVIEWS = "reviews",
  COMPANIES = "companies",
}

export enum SUCCESS_MESSAGE {
  USER_SIGNUP = "Account created successfully!",
  BOOKINGS_COMPLETE = "Booking request completed!",
  BOOKING_UPDATED = "Booking updated successfully!",
  BOOKING_DELETED = "Booking deleted successfully!",
  BOOKING_CANCELLED = "Booking cancelled successfully!",
  PROFILE_UPDATE = "Profile updated successfully!",
}

export enum ErrorMessage {
  UNEXPECTED_ERROR = "An unexpected error occurred. Please try again.",
  SERVICE_REQUEST_MADE = "You have completed that service request!",
  FAILED_ACTION = "Sorry, we couldn't make that happen. Try again.",
}

export enum CacheKey {
  BOOKINGS_STATE = "BOOKINGS_STATE",
  CHATS_STATE = "CHATS_STATE",
  CHAT_STATE = "CHAT_STATE",
  CHAT_MESSAGES_STATE = "CHAT_MESSAGES_STATE",
  QUOTE_STATE = "QUOTE_STATE",
  REVIEW_STATE = "REVIEW_STATE",
  COMPANIES_STATE = "COMPANIES_STATE",
  COMPANY_STATE = "COMPANY_STATE",
}
