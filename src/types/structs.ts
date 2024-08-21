import {
  bookMoveSequenceStep1Schema,
  bookMoveSequenceStep2Schema,
  bookMoveSequenceStep3Schema,
  bookMoveSequenceStep4Schema,
  hireLabourSequenceStep1Schema,
  hireLabourSequenceStep2Schema,
  hireLabourSequenceStep3Schema,
  bookDeliverySequenceStep1Schema,
  bookDeliverySequenceStep2Schema,
  bookDeliverySequenceStep3Schema,
  bookDeliverySequenceStep4Schema,
} from "@/core/validators";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { ReactNode } from "react";
import { z } from "zod";

export interface ApiResponse<T> {
  data: T;
  status?: boolean;
}

export interface Services {
  id: string;
  label: string;
  description: string;
}
export type BookMove = z.infer<typeof bookMoveSequenceStep1Schema> &
  z.infer<typeof bookMoveSequenceStep2Schema> &
  z.infer<typeof bookMoveSequenceStep3Schema> &
  z.infer<typeof bookMoveSequenceStep4Schema> & {
    requestType?: string;
    tempImages?: string[];
    bookingId?: string;
  };
export type HireLabour = z.infer<typeof hireLabourSequenceStep1Schema> &
  z.infer<typeof hireLabourSequenceStep2Schema> &
  z.infer<typeof hireLabourSequenceStep3Schema>;
export type BookDelivery = z.infer<typeof bookDeliverySequenceStep1Schema> &
  z.infer<typeof bookDeliverySequenceStep2Schema> &
  z.infer<typeof bookDeliverySequenceStep3Schema> &
  z.infer<typeof bookDeliverySequenceStep4Schema>;

export interface Quote {
  companyName: string;
  hourlyRate: number;
  movers: number;
  companyCity: string;
  companyProvince: string;
  movingTruck: string;
  equippedToMove: string[];
  minimumHours: number;
  minimumAmount: number;
  companyEmail: string;
  companyId: string;
  additionalMoverHourlyRate: number;
  majorAppliancesFee: number;
  workoutEquipmentsFee: number;
  flightOfStairsFee: number;
  pianosFee: number;
  truckFee: number;
  stopOverFee: number;
  hotTubsFee: number;
  poolTablesFee: number;
  averageRating: number;
  numberOfReviews: number;
  voucherCode: string;
}

interface MoveTimestamp {
  // Define properties for the MoveTimestamp interface
}

interface FeeAdjustment {
  // Define properties for the FeeAdjustment interface
}

interface Address {
  address: string;
  apartmentNumber: string;
  buildingType: string;
  flightOfStairs: number;
  googlePlaceId: string;
  hasElevator: string;
}

export interface Booking {
  bookingId?: string;
  clientId: string;
  driverId: string;
  fromAddress: Address;
  toAddress: Address;
  additionalStops?: Address[];
  hasAdditionalStops: boolean;
  hasAddOns: boolean;
  status:
    | "New"
    | "Pending"
    | "Confirmed"
    | "Rejected"
    | "InProgress"
    | "Completed"
    | "DepositHeld"
    | "Cancelled"
    | "Edited"
    | "Paused"
    | "PendingPayment";
  movingDate: string;
  bookingDate: string;
  modifiedDate?: Date;
  cancelledDate?: Date;
  moveStartTime?: Date;
  moveResumeTime?: Date;
  moveEndTime?: Date;
  totalAmount?: number;
  additionalAmount?: number;
  gstAmount?: number;
  workoutEquipmentsQuantity?: number;
  majorAppliancesQuantity?: number;
  pianosQuantity?: number;
  hotTubsQuantity?: number;
  poolTablesQuantity?: number;
  quote: Quote;
  paymentIntentId?: string;
  moveTimestamps?: MoveTimestamp[];
  oldMinimumAmount?: number;
  additionalNotes?: string;
  requestType: "RegularMove" | "LabourOnly" | "Delivery";
  serviceAddOns?: string[];
  estimatedNumberOfBoxes?: number;
  feeAdjustments?: FeeAdjustment[];
  images?: string[];
}

export interface MoveQuote extends Quote {
  vehicle: string;
}
export interface LabourQuote extends Quote {
  activity: Array<string>;
}
export interface DeliveryQuote extends Omit<Quote, "movers"> {
  time: string;
  distance: string;
}

export interface QuoteDetailsRate {
  icon: ReactNode;
  label: string;
  rate: number;
  count?: number;
}

export interface IUser extends User {
  fullName: string;
  hasCreditCard: boolean;
}

export type DocUser = Record<
  "id" | "email" | "fullName" | "phoneNumber",
  string
>;

export type Chat = Booking & { id: string };

export interface ChatMessage {
  chatId: string; // NOTE: Booking doc ID
  fromClient: boolean;
  timestamp: Date | string;
  text: string;
}

export interface Voucher {
  clientDiscount: number;
  code: string;
  discountType: "Amount" | "Percentage";
  endDate: string | Date | Timestamp;
  promoterDiscount: number;
  startDate: string | Date | Timestamp;
}

export interface Review {
  id: string;
  comment: string;
  companyId: string;
  isVendorReply: false;
  modifiedDate: null;
  parentId: null;
  rating: number;
  reviewDate: Timestamp;
  userId: string;
  userName: string;
}
