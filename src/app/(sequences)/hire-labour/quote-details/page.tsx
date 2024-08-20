"use client";
import {
  AdditionalStops,
  Alarm,
  Appliances,
  FlightOfStairs,
  Piano,
  TruckFrontGrey,
} from "@/components/Icons";
import { P } from "@/components/atoms";
import { Column, Row } from "@/components/layout";
import {
  QuoteDetails,
  QuoteDetailsCharge,
  QuoteDetailsMap,
  QuoteDetailsRates,
  QuoteDetailsServiceRequirement,
  QuoteDetailsWorkers,
  QuoteDetailsEditRequest,
  QuoteDetailsDate,
  QuoteDetailsStatus,
  QuoteDetailsLocation,
  QuoteDetailsNotesImages,
} from "@/components/quotations/quote-details";
import { StorageKeys } from "@/constants/enums";
import { useQuoteDetailsData } from "@/contexts/QuoteDetails.context";
import { Routes } from "@/core/routing";
import { formatCurrency } from "@/lib/utils";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import useBookingStore from "@/stores/booking.store";
import type { Quote } from "@/types/structs";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { format } from "date-fns";

const Page = () => {
  const searchParams = useSearchParams();
  const selectedBooking = useBookingStore.use.selectedBooking();
  const finishing = searchParams.get("action") === "finish",
    updating = searchParams.get("action") === "update";
  const iconSizes = {
    width: 21,
    height: 21,
  };
  const { quoteDetailsData } = useQuoteDetailsData();
  const {
    companyName,
    numberOfReviews,
    movers,
    truckFee,
    flightOfStairsFee,
    pianosFee,
    minimumHours,
    hourlyRate,
    stopOverFee,
    majorAppliancesFee,
    hotTubsFee,
    poolTablesFee,
    workoutEquipmentsFee,
    minimumAmount,
  } = finishing
    ? (selectedBooking?.quote as Quote) ?? {}
    : quoteDetailsData || {};

  console.log("quotes: ", selectedBooking?.quote, quoteDetailsData);
  const formData = JSON.parse(
    localStorage.getItem(StorageKeys.FORM_DATA) || "{}"
  );
  console.log("formData: ", formData);

  let bookingDate, bookingTime, locations;

  if (finishing) {
    bookingDate = format(
      new Date(selectedBooking?.movingDate ?? ""),
      "d MMMM yyyy"
    );
    bookingTime = format(
      new Date(selectedBooking?.movingDate ?? ""),
      "hh:mm a"
    );
    locations = [selectedBooking?.fromAddress];
  }

  // const amount = useMemo(() => {
  //   const majorAppliancesAmount =
  //     (+formData.majorAppliances! || 0) * majorAppliancesFee;
  //   const workoutEquipmentsAmount =
  //     (+formData.workOutEquipment! || 0) * workoutEquipmentsFee;
  //   const pianosAmount = (+formData.pianos! || 0) * pianosFee;
  //   const hotTubsAmount = (+formData.hotTubs! || 0) * hotTubsFee;
  //   const poolTablesAmount = (+formData.poolTables! || 0) * poolTablesFee;
  //   const stopsAmount = (formData.stops?.length || 0) * stopOverFee;
  //   const flightOfStairsAmount =
  //     ((+formData.PUDPickUpLocation?.flightOfStairs! || 0) +
  //       (+formData.PUDFinalDestination?.flightOfStairs! || 0) +
  //       (formData.PUDStops?.reduce(
  //         (acc: number, curr: { flightOfStairs: number }) =>
  //           acc + (+curr?.flightOfStairs! || 0),
  //         0
  //       ) ?? 0) ?? 0) * flightOfStairsFee;
  //   return (
  //     minimumAmount +
  //     majorAppliancesAmount +
  //     workoutEquipmentsAmount +
  //     pianosAmount +
  //     hotTubsAmount +
  //     poolTablesAmount +
  //     stopsAmount +
  //     flightOfStairsAmount
  //   );
  // }, [
  //   minimumAmount,
  //   formData.majorAppliances,
  //   majorAppliancesFee,
  //   formData.workOutEquipment,
  //   workoutEquipmentsFee,
  //   formData.pianos,
  //   pianosFee,
  //   formData.hotTubs,
  //   hotTubsFee,
  //   formData.poolTables,
  //   poolTablesFee,
  //   formData.stops?.length,
  //   stopOverFee,
  //   formData.PUDPickUpLocation?.flightOfStairs,
  //   formData.PUDFinalDestination?.flightOfStairs,
  //   formData.PUDStops,
  //   flightOfStairsFee,
  // ]);

  if (companyName === "") {
    return (
      <Row className="w-full h-full items-center justify-center">
        <Column className="items-center justify-center max-w-max gap-4">
          <CircleAlert className="textPrimary" />
          <P className="text-primary text-base">No quote detail available!</P>
          <Link
            href={
              finishing
                ? `${Routes.sequence.hireLabour}`
                : Routes.hireLabourQuotes
            }
            className="border p-2 px-4 rounded-sm"
          >
            <P className="text-grey-300 text-sm border-primary-foreground">
              {finishing
                ? "Update your booking"
                : " See available quotes for previous request "}
            </P>
          </Link>
        </Column>
      </Row>
    );
  }

  return (
    <Column className="w-full">
      {finishing && (
        <Row className="lg:items-end justify-between flex-col lg:flex-row">
          {/* @ts-ignore */}
          <QuoteDetailsLocation locations={locations} />
          <Row className="flex-1 max-w-[400px] order-1 lg:order-2">
            <QuoteDetailsDate
              date={bookingDate ?? ""}
              time={bookingTime ?? ""}
            />
            <QuoteDetailsStatus status={selectedBooking?.status ?? "New"} />
          </Row>
        </Row>
      )}{" "}
      <QuoteDetails className="flex-col sm:flex-row w-full">
        <Column className="gap-4 flex-1">
          <Row className="gap-4 flex-col lg:flex-row">
            <QuoteDetailsMap
              className="flex-1"
              data={{
                location: {
                  lat: "",
                  long: "",
                },
                name: companyName,
                charge: hourlyRate,
                reviews: numberOfReviews,
                movesCompleted: "nil",
              }}
            />
            <QuoteDetailsWorkers
              movers={movers}
              disabled={finishing}
              workerTag="Laborers"
              finishing={finishing}
              className="flex-1"
            />
          </Row>
          <QuoteDetailsRates
            rates={[
              {
                icon: <TruckFrontGrey {...iconSizes} />,
                label: "Truck Fee",
                rate: truckFee,
              },
              {
                icon: <Appliances {...iconSizes} />,
                label: "Appliances",
                rate: majorAppliancesFee,
                ...(+(formData.majorAppliances ?? 0)
                  ? { count: +(formData.majorAppliances ?? 0) }
                  : {}),
              },
              {
                icon: <FlightOfStairs {...iconSizes} />,
                label: "Flight of Stairs",
                rate: flightOfStairsFee,
              },
              {
                icon: <Piano {...iconSizes} />,
                label: "Piano",
                rate: pianosFee,
                ...(+(formData.pianos ?? 0)
                  ? { count: +(formData.pianos ?? 0) }
                  : {}),
              },
              {
                icon: <AdditionalStops {...iconSizes} />,
                label: "Additional Stops",
                rate: stopOverFee,
              },
              {
                icon: <Appliances {...iconSizes} />,
                label: "Hot Tub",
                rate: hotTubsFee,
                ...(+(formData.hotTubs ?? 0)
                  ? { count: +(formData.hotTubs ?? 0) }
                  : {}),
              },
              {
                icon: <Appliances {...iconSizes} />,
                label: "Pool Table",
                rate: poolTablesFee,
                ...(+(formData.poolTables ?? 0)
                  ? { count: +(formData.poolTables ?? 0) }
                  : {}),
              },
              {
                icon: <Appliances {...iconSizes} />,
                label: "Workout Equipments",
                rate: workoutEquipmentsFee,
                ...(+(formData.workOutEquipment ?? 0)
                  ? { count: +(formData.workOutEquipment ?? 0) }
                  : {}),
              },
              {
                icon: <Alarm {...iconSizes} />,
                label: "Minimum Hours",
                count: minimumHours,
                rate: hourlyRate * minimumHours,
              },
            ]}
          />
          {finishing && (
            <QuoteDetailsNotesImages
              images={[]}
              notes={selectedBooking?.additionalNotes ?? ""}
            />
          )}
        </Column>
        <Column className="gap-4 max-w-[400px] flex-1">
          <QuoteDetailsServiceRequirement
            services={formData.services}
            disabled={finishing || selectedBooking?.status === "Cancelled"}
          />
          {((!updating && !finishing) ||
            selectedBooking?.status !== "Cancelled") && (
            <>
              <QuoteDetailsCharge
                amount={minimumAmount}
                hourlyRate={formatCurrency(hourlyRate)}
                finishing={finishing}
                updating={updating}
              />
              {finishing && <QuoteDetailsEditRequest type="LabourOnly" />}
            </>
          )}
        </Column>
      </QuoteDetails>
    </Column>
  );
};

export default Page;
