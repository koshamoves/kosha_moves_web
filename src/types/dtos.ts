import { RequestType } from "./structs";

export interface SignInDto {
  email: string,
  password: string
}

export interface SignUpDto {
  name: string,
  phone: string,
  email: string,
  password: string
}

export interface ForgotPasswordDto {
  email: string
}

export class SearchRequestDto {
  declare fromAddress: AddressDto;
  declare toAddress: AddressDto;
  declare additionalStops: AddressDto[];
  declare date: Date;
  declare addOns: AddOnDto[];
  declare bookingId: string;
  declare companyId?: string;
  declare minimumAmount?: number;
  declare additionalNotes?: string;
  declare requestType: RequestType;
  declare serviceAddOns?: ServiceAddOnDto[];
  declare numberOfBoxes: number;
  declare photos: photoDto[];
}

export class AddressDto {
  declare id: string;
  declare address: string;
  declare buildingType: string;
  declare hasElevator: string;
  declare flightOfStairs: number;
  declare apartmentNumber: string;
  declare googlePlaceId: string;
}

export class ServiceAddOnDto {
  declare name: string;
  declare title: string;
  declare value: boolean;

  constructor(name: string, title: string, value: boolean) {
    this.name = name;
    this.title = title;
    this.value = value;
  }
}

export class photoDto {
  declare name: string;
  declare savedInStorage: boolean;
  declare bytes: Uint8Array | undefined;
}

export class AddOnDto {
  declare name: string;
  declare quantity: number;
}



export class MoveRequestDto {
  declare clientId: string;
  declare clientName: string;
  declare driverId: string;
  declare bookingDate: Date;
  declare searchRequest: SearchRequestDto;
  declare quote: QuoteDto;
}

export enum BookingStatusDto {
  New,
  Pending,
  Confirmed,
  Rejected,
  InProgress,
  Completed,
  DepositHeld,
  Cancelled,
  Edited,
  Paused,
  PendingPayment,
}

export class MoveUpdateDto {
  declare bookingId: string;
  declare moveRequest: MoveRequestDto;
  declare modifiedDate: Date;
  declare status: BookingStatusDto;
}

export interface QuoteDto {
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



export interface GoogleAutoCompleteDto {
  input: string,
  location?: {
    lat: string,
    lng: string
  }
  radius: number
}