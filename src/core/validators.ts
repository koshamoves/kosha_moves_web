import { z } from "zod";

const emailSchema = z.string().email({ message: "Invalid email address" });

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
  keepMeLoggedIn: z.boolean().default(false).optional(),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .refine(
      (value) => {
        const names = value.split(/\s+/);
        return names.length === 2 && names.every((name) => name.length >= 2);
      },
      {
        message: "Full name should include both first name and last name",
      }
    ),
  phone: z.string().regex(/^(?:\+234|0)?(70|80|81|90|91)\d{8}$/, {
    message: "Invalid Nigerian phone number format",
  }),
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
  acceptTerms: z.boolean(),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
const creditCardNumberPattern =
  /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9]{2})[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
export const addCardSchema = z.object({
  name: z
    .string()
    .trim()
    .refine(
      (value) => {
        const names = value.split(/\s+/);
        return names.length === 2 && names.every((name) => name.length >= 2);
      },
      {
        message: "Full name should include both first name and last name",
      }
    ),
  cardNumber: z.string().regex(creditCardNumberPattern, {
    message: "Invalid credit card number",
  }),
  expiryDate: z.string().min(1, { message: "required" }),
  cvv: z
    .string()
    .min(3, { message: "CVV must be exactly 3 digits" })
    .max(3, { message: "CVV must be exactly 3 digits" }),
});

const locationSchema = z.object({
  location: z.string().min(1, { message: "Location is required" }),
  apartmentNumber: z.string().optional(),
  googlePlaceId: z.string().optional(),
});

export const bookMoveSequenceStep1Schema = z.object({
  moveDate: z.date({ message: "Move date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  pickUpLocation: locationSchema,
  stops: z.array(locationSchema),
  finalDestination: locationSchema,
});

const pickUpDetailSchema = z
  .object({
    buildingType: z.string().min(1, { message: "Required" }),
    elevatorAccess: z.string(),
    flightOfStairs: z.string().optional(),
  })
  .superRefine(({ buildingType, elevatorAccess }, ctx) => {
    if (buildingType !== "House" && elevatorAccess.length === 0)
      ctx.addIssue({
        code: "custom",
        message: "Required",
        path: ["elevatorAccess"],
      });
  });

export const bookMoveSequenceStep2Schema = z.object({
  PUDPickUpLocation: pickUpDetailSchema,
  PUDStops: z.array(pickUpDetailSchema).optional(),
  PUDFinalDestination: pickUpDetailSchema,
});

export const bookMoveSequenceStep3Schema = z.object({
  majorAppliances: z.string().optional(),
  workOutEquipment: z.string().optional(),
  pianos: z.string().optional(),
  hotTubs: z.string().optional(),
  poolTables: z.string().optional(),
  numberOfBoxes: z.string().optional(),
  instructions: z.string().optional(),
  images: z.array(z.string()),
  pictures: z.array(z.string()).optional(),
  receipts: z.array(z.string()).optional(),
});

export const bookMoveSequenceStep4Schema = z.object({
  services: z.array(z.string()),
});

export const hireLabourSequenceStep1Schema = z
  .object({
    date: z.date({ message: "Date is required" }),
    time: z.string().min(1, { message: "Time is required" }),
    serviceLocation: z.string().min(1, { message: "Location is required" }),
    apartmentNumber: z.string().optional(),
    googlePlaceId: z.string().optional(),
  })
  .extend(pickUpDetailSchema.shape);

export const hireLabourSequenceStep2Schema = bookMoveSequenceStep3Schema;

export const hireLabourSequenceStep3Schema = bookMoveSequenceStep4Schema;

export const bookDeliverySequenceStep1Schema = z.object({
  deliveryDate: z.date({ message: "Move date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  pickUpLocation: locationSchema,
  stops: z.array(locationSchema),
  deliveryLocation: locationSchema,
});

export const bookDeliverySequenceStep2Schema = bookMoveSequenceStep2Schema;

export const bookDeliverySequenceStep3Schema = bookMoveSequenceStep3Schema.pick(
  {
    images: true,
    instructions: true,
    pictures: true,
    receipts: true,
  }
);

export const bookDeliverySequenceStep4Schema = bookMoveSequenceStep4Schema;

export const sendMessageSchema = z.object({
  message: z.string().optional(),
  file:
    typeof window === "undefined"
      ? z.any().optional()
      : z.instanceof(File).optional(),
});
