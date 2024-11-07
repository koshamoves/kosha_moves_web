import { BookMoveDto } from "@/types/dtos";
import { Booking, HireLabour } from "@/types/structs";
import { format } from "date-fns";

export const hireLabourFactory = (a: HireLabour): Partial<BookMoveDto> => {
  const addOns = [
    { name: "Major Appliances", quantity: parseInt(a.majorAppliances ?? "0") },
    {
      name: "Workout Equipment",
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
  const formattedDate = format(new Date(a.date), "M/d/yyyy");
  const formattedTime = (() => {
    const [time, period] = a.time.split(' '); // e.g., "12:30 PM"
    const [hours, minutes] = time.split(':').map(Number);
    const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : hours === 12 && period === 'AM' ? 0 : hours;
    return format(new Date(1970, 0, 1, adjustedHours, minutes), "h:mm a");
  })();

  return {
    fromAddress: {
      address: a.serviceLocation,
      apartmentNumber: a.apartmentNumber ?? "",
      buildingType: a.buildingType,
      flightOfStairs: a.flightOfStairs ? parseInt(a.flightOfStairs) : 0,
      googlePlaceId: a.googlePlaceId ?? "",
      hasElevator: a.elevatorAccess,
      id: "",
    },
    toAddress: {
      address: "",
      apartmentNumber: "",
      buildingType: "",
      flightOfStairs: 0,
      googlePlaceId: "",
      hasElevator: "",
      id: "",
    },
    date: `${formattedDate} ${formattedTime}`,
    additionalStops: [],
    addOns: filteredAddOns,
    requestType: "LabourOnly",
  };
};

export const hireLabourReverseFactory = (
  booking: Partial<Booking>
): HireLabour => {
  return {
    date: new Date(booking.movingDate ?? new Date()),
    time: booking.movingDate ? format(booking.movingDate, "HH:mm") : "",
    serviceLocation: booking.fromAddress?.address ?? "",
    googlePlaceId: booking.fromAddress?.googlePlaceId ?? "",
    apartmentNumber: booking.fromAddress?.apartmentNumber ?? "",
    elevatorAccess: booking.fromAddress?.hasElevator ?? "Yes",
    flightOfStairs: `${booking.fromAddress?.flightOfStairs ?? "0"}`,
    buildingType: booking.fromAddress?.buildingType ?? "Condo",
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
