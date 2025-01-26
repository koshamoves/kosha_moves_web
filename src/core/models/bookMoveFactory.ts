import { mergeArrays } from "@/lib/utils";
import { photoDto, SearchRequestDto } from "@/types/dtos";
import { BookMove, Booking, RequestType } from "@/types/structs";
import { format } from "date-fns";

const parseFlightOfStairs = (stop: any) => ({
  ...stop,
  flightOfStairs:
    typeof stop.flightOfStairs === "string"
      ? parseInt(stop.flightOfStairs) || 0
      : typeof stop.flightOfStairs === "number"
        ? stop.flightOfStairs
        : 0,
});

/**
 * Creates a BookMoveDto from a given BookMove.
 *
 * @param a - The BookMove object to convert.
 * @returns The corresponding BookMoveDto.
 *
 * requestType is defaulted
 */
export const bookMoveFactory = (a: BookMove): SearchRequestDto => {
  //TODO: Handle driverId

  const addOns = [
    { name: "Major Appliances", quantity: parseInt(a.majorAppliances ?? "0") },
    {
      name: "Workout Equipments",
      quantity: parseInt(a.workOutEquipment ?? "0"),
    },
    { name: "Pianos", quantity: parseInt(a.pianos ?? "0") },
    { name: "Hot Tubs", quantity: parseInt(a.hotTubs ?? "0") },
    { name: "Pool Tables", quantity: parseInt(a.poolTables ?? "0") },
    { name: "Number of Boxes", quantity: parseInt(a.numberOfBoxes ?? "0") },
  ];

  const filteredAddOns = addOns.filter(
    (item) => !isNaN(item.quantity) && item.quantity > 0
  );

  const photos : photoDto [] = [
    {
      name: "",
      savedInStorage: false,
      bytes: undefined
    }
  ]

  const formattedDate = format(new Date(a.moveDate), "M/d/yyyy");
  const formattedTime = (() => {
    const [time, period] = a.time.split(' '); // e.g., "12:30 PM"
    const [hours, minutes] = time.split(':').map(Number);
    const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : hours === 12 && period === 'AM' ? 0 : hours;
    return format(new Date(1970, 0, 1, adjustedHours, minutes), "h:mm a");
  })();

  return {
    fromAddress: {
      address: a.pickUpLocation.location,
      apartmentNumber: a.pickUpLocation.apartmentNumber ?? "",
      buildingType: a.PUDPickUpLocation.buildingType,
      flightOfStairs: a.PUDPickUpLocation.flightOfStairs
        ? parseInt(a.PUDPickUpLocation.flightOfStairs)
        : 0,
      googlePlaceId: a.pickUpLocation.googlePlaceId ?? "",
      hasElevator: a.PUDPickUpLocation.elevatorAccess,
      id: "",
    },
    toAddress: {
      address: a.finalDestination.location,
      apartmentNumber: a.finalDestination.apartmentNumber ?? "",
      buildingType: a.PUDFinalDestination.buildingType,
      flightOfStairs: a.PUDFinalDestination.flightOfStairs
        ? parseInt(a.PUDFinalDestination.flightOfStairs)
        : 0,
      googlePlaceId: a.finalDestination.googlePlaceId ?? "",
      hasElevator: a.PUDFinalDestination.elevatorAccess,
      id: "",
    },
    date: a.moveDate,
    additionalStops: mergeArrays(a.stops, a.PUDStops).map(parseFlightOfStairs),
    addOns: filteredAddOns,
    requestType: RequestType.RegularMove,
    bookingId: a.bookingId ?? "",
    numberOfBoxes: parseInt(a.numberOfBoxes ?? "0"),
    photos: photos
  };
};

export const bookMoveReverseFactory = (booking: Partial<Booking>): BookMove => {
  return {
    moveDate: new Date(booking.movingDate ?? new Date()),
    time: booking.movingDate ? format(booking.movingDate, "HH:mm") : "",
    pickUpLocation: {
      location: booking.fromAddress?.address ?? "",
      apartmentNumber: booking.fromAddress?.apartmentNumber ?? "",
      googlePlaceId: booking.fromAddress?.googlePlaceId ?? "",
    },
    stops: (booking.additionalStops as []) ?? [],
    finalDestination: {
      location: booking.toAddress?.address ?? "",
      apartmentNumber: booking.toAddress?.apartmentNumber ?? "",
      googlePlaceId: booking.toAddress?.googlePlaceId ?? "",
    },
    PUDFinalDestination: {
      elevatorAccess: booking.toAddress?.hasElevator ?? "Yes",
      flightOfStairs: `${booking.toAddress?.flightOfStairs ?? "0"}`,
      buildingType: booking.toAddress?.buildingType ?? "Condo",
    },
    PUDPickUpLocation: {
      elevatorAccess: booking.fromAddress?.hasElevator ?? "Yes",
      flightOfStairs: `${booking.fromAddress?.flightOfStairs ?? "0"}`,
      buildingType: booking.fromAddress?.buildingType ?? "Condo",
    },
    PUDStops: [],
    majorAppliances: `${booking.majorAppliancesQuantity ?? ""}`,
    workOutEquipment: `${booking.workoutEquipmentsQuantity ?? ""}`,
    pianos: `${booking.pianosQuantity ?? ""}`,
    hotTubs: `${booking.hotTubsQuantity ?? ""}`,
    poolTables: `${booking.poolTablesQuantity ?? ""}`,
    numberOfBoxes: `${booking.estimatedNumberOfBoxes ?? ""}`,
    instructions: booking.additionalNotes ?? "",
    images: booking.images ?? [],
    tempImages: booking.images ?? [],
    services: booking.serviceAddOns ?? [],
  };
};
