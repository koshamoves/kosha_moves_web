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
  QuoteDetailsVehicle,
  QuoteDetailsWorkers,
  QuoteDetailsEditRequest,
  QuoteDetailsStatus,
  QuoteDetailsDate,
  QuoteDetailsLocation,
  QuoteDetailsNotesImages,
  QuoteDetailsServiceRequirement,
} from "@/components/quotations/quote-details";
import { useQuoteDetailsData } from "@/contexts/QuoteDetails.context";
import { Routes } from "@/core/routing";
import { formatCurrency, safeParseDate } from "@/lib/utils";
import { CircleAlert, StarIcon } from "lucide-react";
import Link from "next/link";
import useBookingStore from "@/stores/booking.store";
import useBookMoveStore from "@/stores/book-move.store";
import type { Quote } from "@/types/structs";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { format } from "date-fns";

const Page = () => {
  const searchParams = useSearchParams();
  const formData = useBookMoveStore((store) => store.formData);
  const selectedBooking = useBookingStore.use.selectedBooking();
  const finishing = searchParams.get("action") === "finish";
  const updating = searchParams.get("action") === "update";
  const { quoteDetailsData } = useQuoteDetailsData();

  const iconSizes = { width: 21, height: 21 };

  // TODO: I think there are still unused sizes here
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
    minimumAmount, // FIXME: What to do with This? Update this value Perhaps? 
    additionalMoverHourlyRate,
    movingTruck,
  } = finishing
    ? (selectedBooking?.quote as Quote) ?? {}
    : quoteDetailsData || {};


  // FIXME: Ensure that we're properly editing the right stuff

  // FIXME: My current understanding is that lets, say that truckFee is 109, and movers is 3 by default.
  // If we add one mover, the current rate becomes truckFee + (1 * additionalMoverHourlyRate)
  // If we remove one mover, the current rate becomes truckFee + (-1 * additionalMoverHourlyRate). 
  //
  // This means that the truckFee assumes 3 movers by default and therefore that can't be included in our calculation.
  // <QuoteDetailsWorkers /> messess with the actual `movers` value we work with, so to remember what's alrady priced in,
  // we should cache the Original Mover Count
  //

  // TODO: Ensure that we can't go below the minimum amount of movers in <QuoteDetailsWorkers />

  const [originalMoverCount, _] = useState(movers);
  const realTruckFee = truckFee + additionalMoverHourlyRate * Math.max(0, movers - originalMoverCount);
  const realHourlyRate = hourlyRate + additionalMoverHourlyRate * Math.max(0, movers - originalMoverCount);

  const totalStairs = (formData.PUDStops ?? []).reduce(
    (t, s) => t + +(s.flightOfStairs ?? 0),
    +(formData.PUDPickUpLocation.flightOfStairs ?? 0) + +(formData.PUDFinalDestination.flightOfStairs ?? 0)
  );

  // see lib/screens/quote_detail.dart in koshamoves/kosha_moves_mobile
  // TODO: use useMemo to cache the total amount
  const totalAmount =
    realTruckFee +
    realHourlyRate +
    +(formData.majorAppliances ?? 0) * majorAppliancesFee +
    +(formData.majorAppliances ?? 0) * majorAppliancesFee +
    totalStairs * flightOfStairsFee +
    +(formData.pianos ?? 0) * pianosFee +
    +(formData.PUDStops?.length ?? 0) * stopOverFee +
    +(formData.hotTubs ?? 0) * hotTubsFee +
    +(formData.poolTables ?? 0) * poolTablesFee +
    +(formData.workOutEquipment ?? 0) * workoutEquipmentsFee;

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
    locations = [
      selectedBooking?.fromAddress,
      ...(selectedBooking?.additionalStops ?? []),
      selectedBooking?.toAddress,
    ].filter(Boolean);
  }

  if (companyName === "") {
    return (
      <Row className="w-full h-full items-center justify-center">
        <Column className="items-center justify-center max-w-max gap-4">
          <CircleAlert className="textPrimary" />
          <P className="text-primary text-base">No quote detail available!</P>
          <Link
            href={
              finishing ? `${Routes.sequence.bookMove}` : Routes.bookMoveQuotes
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

  const companyId =
    selectedBooking?.quote?.companyId ?? quoteDetailsData.companyId;
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
      )}
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
                charge: realHourlyRate,
                reviews: numberOfReviews,
                movesCompleted: "nil",
                companyId: companyId,
              }}
            />
            <QuoteDetailsWorkers
              className="flex-1"
              movers={movers}
              minMovers={originalMoverCount}
              disabled={finishing}
              finishing={finishing}
            />
          </Row>
          <QuoteDetailsRates
            rates={[
              {
                icon: <TruckFrontGrey {...iconSizes} />,
                label: "Travelers Fee",
                rate: realTruckFee,
                count: 1, // FIXME: is the count always 1? 
              },
              {
                icon: <Appliances {...iconSizes} />,
                label: "Appliances",
                rate: majorAppliancesFee,
                count: +(formData.majorAppliances ?? 0),
              },
              {
                icon: <FlightOfStairs {...iconSizes} />,
                label: "Flight of Stairs",
                rate: flightOfStairsFee,
                count: totalStairs,
              },
              {
                icon: <Piano {...iconSizes} />,
                label: "Piano",
                rate: pianosFee,
                count: +(formData.pianos ?? 0),
              },
              {
                icon: <AdditionalStops {...iconSizes} />,
                label: "Additional Stops",
                rate: stopOverFee,
                count: +(formData.PUDStops?.length ?? 0),
              },
              {
                icon: <Appliances {...iconSizes} />,
                label: "Hot Tub",
                rate: hotTubsFee,
                count: +(formData.hotTubs ?? 0),
              },
              {
                icon: <Appliances {...iconSizes} />,
                label: "Pool Table",
                rate: poolTablesFee,
                count: +(formData.poolTables ?? 0),
              },
              {
                icon: <Appliances {...iconSizes} />,
                label: "Workout Equipment",
                rate: workoutEquipmentsFee,
                count: +(formData.workOutEquipment ?? 0),
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
                ? formData?.images ?? []
                : selectedBooking?.images ?? []
            }
            notes={
              !finishing
                ? formData.instructions ?? ""
                : selectedBooking?.additionalNotes ?? ""
            }
          />
        </Column>
        <Column className="gap-4 flex-1 max-w-[400px]">
          <QuoteDetailsServiceRequirement
            services={formData.services}
            disabled={finishing || selectedBooking?.status === "Cancelled"}
          />
          <QuoteDetailsVehicle
            truckType={movingTruck}
            disabled={finishing || selectedBooking?.status === "Cancelled"}
            finishing={finishing}
          />
          {((!updating && !finishing) ||
            selectedBooking?.status !== "Cancelled") && (
              <>
                <QuoteDetailsCharge
                  amount={totalAmount}
                  hourlyRate={formatCurrency(realHourlyRate)}
                  finishing={finishing}
                  updating={updating}
                />
                {finishing && <QuoteDetailsEditRequest type="RegularMove" />}
              </>
            )}
          {companyId && (
            <Button className=" text-white-100" asChild>
              <Link href={`/reviews/${companyId}`}>
                <StarIcon className="scale-75 mr-2" /> See company reviews
              </Link>
            </Button>
          )}
        </Column>
      </QuoteDetails>
    </Column>
  );
};

export default Page;
