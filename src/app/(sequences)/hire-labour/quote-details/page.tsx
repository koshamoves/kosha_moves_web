"use client";
import {
  AdditionalStops,
  Alarm,
  Appliances,
  FlightOfStairs,
  Piano,
  TruckFrontGrey,
} from "@/components/Icons";
import { Button, P } from "@/components/atoms";
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
import { Routes } from "@/core/routing";
import { formatCurrency, safeParseDate, thing2 } from "@/lib/utils";
import { CircleAlert, StarIcon } from "lucide-react";
import Link from "next/link";
import useBookingStore from "@/stores/booking.store";
import { RequestType, type Quote } from "@/types/structs";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import useQuoteDetailsStore from "@/stores/quote-details.store";
import useHireLabourStore from "@/stores/hire-labour.store";

const Page = () => {
  const searchParams = useSearchParams();
  const selectedBooking = useBookingStore.use.selectedBooking();
  const finishing = searchParams.get("action") === "finish",
    updating = searchParams.get("action") === "update";
  const iconSizes = {
    width: 21,
    height: 21,
  };

  const quoteDetails = thing2(useQuoteDetailsStore());

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
    additionalMoverHourlyRate
  } = finishing
      ? (selectedBooking?.quote as Quote) ?? {}
      : quoteDetails || {};

  let {
    majorAppliances,
    pianos,
    flightOfStairs,
    hotTubs,
    poolTables,
    workOutEquipment,
    images,
    instructions,
    services,
  } = useHireLabourStore(state => state);


  let bookingDate, bookingTime, locations;
  if (finishing) {
    bookingDate = format(
      safeParseDate(selectedBooking?.movingDate) as Date,
      "d MMMM yyyy"
    );
    bookingTime = format(
      safeParseDate(selectedBooking?.movingDate) as Date,
      "hh:mm a"
    );
    locations = [selectedBooking?.fromAddress];
  }


  /// FIXME: see app/(sequences)/hire-labour/quote-details/page.tsx
  const [originalMoverCount, _] = useState(movers);
  const realTruckFee = truckFee + additionalMoverHourlyRate * Math.max(0, movers - originalMoverCount);
  const realHourlyRate = hourlyRate + additionalMoverHourlyRate * Math.max(0, movers - originalMoverCount);

  const totalAmount =
    realTruckFee +
    realHourlyRate * minimumHours +
    +(majorAppliances ?? 0) * majorAppliancesFee +
    +(pianos ?? 0) * pianosFee +
    +(flightOfStairs ?? 0) * flightOfStairsFee +
    +(hotTubs ?? 0) * hotTubsFee +
    +(poolTables ?? 0) * poolTablesFee +
    +(workOutEquipment ?? 0) * workoutEquipmentsFee;

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

  const companyId = selectedBooking?.quote?.companyId ?? quoteDetails.companyId;
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
                companyId,
              }}
            />
            <QuoteDetailsWorkers
              movers={movers}
              minMovers={originalMoverCount}
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
                count: 1, // FIXME: hardcoded value
              },
              {
                icon: <Appliances {...iconSizes} />,
                label: "Appliances",
                rate: majorAppliancesFee,
                count: +(majorAppliances ?? 0),
              },
              {
                icon: <FlightOfStairs {...iconSizes} />,
                label: "Flight of Stairs",
                rate: flightOfStairsFee,
                count: +(flightOfStairs ?? 0),
              },
              {
                icon: <Piano {...iconSizes} />,
                label: "Piano",
                rate: pianosFee,
                count: +(pianos ?? 0),
              },
              // FIXME: can HireLabour have additional stops? 
              // {
              //   icon: <AdditionalStops {...iconSizes} />,
              //   label: "Additional Stops",
              //   rate: stopOverFee,
              //   count: +(PUDStops?.length ?? 0),
              // },
              {
                icon: <Appliances {...iconSizes} />,
                label: "Hot Tub",
                rate: hotTubsFee,
                count: +(hotTubs ?? 0),
              },
              {
                icon: <Appliances {...iconSizes} />,
                label: "Pool Table",
                rate: poolTablesFee,
                count: +(poolTables ?? 0),
              },
              {
                icon: <Appliances {...iconSizes} />,
                label: "Workout Equipments",
                rate: workoutEquipmentsFee,
                count: +(workOutEquipment ?? 0),
              },
              {
                icon: <Alarm {...iconSizes} />,
                label: "Minimum Hours",
                count: minimumHours,
                rate: realHourlyRate,
              },
            ]}
          />
          <QuoteDetailsNotesImages
            images={
              !finishing
                ? images ?? []
                : selectedBooking?.images ?? []
            }
            notes={
              !finishing
                ? instructions ?? ""
                : selectedBooking?.additionalNotes ?? ""
            }
          />
        </Column>
        <Column className="gap-4 max-w-[400px] flex-1">
          <QuoteDetailsServiceRequirement
            services={services}
            disabled={finishing || selectedBooking?.status === "Cancelled"}
          />
          {((!updating && !finishing) ||
            selectedBooking?.status !== "Cancelled") && (
              <>
                <QuoteDetailsCharge
                  amount={totalAmount}
                  hourlyRate={hourlyRate}
                  finishing={finishing}
                  updating={updating}
                />
                {finishing && <QuoteDetailsEditRequest type={RequestType.LabourOnly} />}
              </>
            )}
        </Column>
        {companyId && (
          <Button className=" text-white-100" asChild>
            <Link href={`/reviews/${companyId}`}>
              <StarIcon className="scale-75 mr-2" /> See company reviews
            </Link>
          </Button>
        )}
      </QuoteDetails>
    </Column>
  );
};

export default Page;
