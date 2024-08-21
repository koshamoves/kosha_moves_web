"use client";
import { Activity, LeftColumn, RightColumn } from "@/components/activity";
import { Button, H, P, Picture } from "@/components/atoms";
import { Calendar } from "@/components/calendar";
import { Column, Row } from "@/components/layout";
import { useGetBookingsByDate } from "@/hooks/fireStore/useGetBookings";
import { useState } from "react";
import {
  Quotes,
  QuotesAmount,
  QuotesContent,
  QuotesImage,
  QuotesMovers,
  QuotesTitle,
  QuotesVehicle,
  QuotesTime,
  QuotesRatings,
} from "@/components/quotations/quotes";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Routes } from "@/core/routing";
import useBookingStore from "@/stores/booking.store";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [date, setDate] = useState<Date>(new Date());
  const { isLoading, data: bookings, error } = useGetBookingsByDate(date);
  const setSelectedBooking = useBookingStore.use.setSelectedBooking();
  const isToday =
    format(date, "MM-dd-yyyy") === format(new Date(), "MM-dd-yyyy");
  return (
    <Row className="gap-8 flex-col md:flex-row">
      <Column className="flex-1 gap-8">
        {/* <Activity>
          <LeftColumn className="gap-8">
            <H level={3} className="text-2xl md:text-3xl">
              Delivery Quote received!
            </H>
            <P className="text-sm">
              You have received an estimate for your delivery request
            </P>
            <Row className="gap-4">
              <Button className="flex-1 bg-white-100 max-w-[120px] text-primary">
                View
              </Button>
              <Button variant="ghost" className="flex-1  max-w-[120px]">
                Discard
              </Button>
            </Row>
          </LeftColumn>
          <RightColumn>
            <Picture
              container={{
                className: "w-full h-full",
              }}
              image={{
                alt: "",
                src: "/images/send.png",
              }}
            />
          </RightColumn>
        </Activity> */}

        <Column className="gap-4">
          <H level={3} className="text-primary text-2xl">
            {isToday ? "Today" : format(date, "do MMMM, yyyy")}
          </H>
          {isLoading && (
            <Row className="flex flex-wrap gap-4">
              <Skeleton className="w-[270px] h-[350px]" />
              <Skeleton className="w-[270px] h-[350px]" />
              <Skeleton className="w-[270px] h-[350px]" />
            </Row>
          )}
          {error && (
            <p className="p-3 py-12 text-center text-red-400">
              Could not fetch bookings. Kindly reload or try again later.
            </p>
          )}
          {bookings && bookings.length === 0 && (
            <p className="p-3 py-12 text-center text-[#2B3674] text-xl">
              You have no bookings{" "}
              {isToday ? "today" : ` on ${format(date, "do MMMM, yyyy")}`}
            </p>
          )}
          <Row className="flex-wrap gap-4">
            {bookings &&
              bookings.map((booking, idx) => (
                <Quotes
                  key={booking.bookingId}
                  onClick={() => {
                    if (
                      /^(RegularMove|LabourOnly)$/.test(
                        booking.requestType ?? ""
                      )
                    ) {
                      setSelectedBooking(booking);
                      router.push(
                        `${
                          booking.requestType === "RegularMove"
                            ? Routes.bookMoveQuoteDetails
                            : Routes.hireLabourQuoteDetails
                        }?action=finish`
                      );
                    }
                  }}
                >
                  <QuotesImage src="" type={booking.requestType!} />
                  <QuotesContent>
                    <Row className="items-start justify-between gap-6 flex-wrap">
                      <Column>
                        <QuotesTitle
                          title={booking.quote?.companyName ?? ""}
                        ></QuotesTitle>
                        {typeof booking.quote?.movers === "number" && (
                          <QuotesMovers>
                            {booking.quote?.movers}{" "}
                            {booking.requestType === "RegularMove"
                              ? "movers"
                              : "laborers"}
                          </QuotesMovers>
                        )}
                      </Column>
                      {!!NaN && (
                        <QuotesTime className="mt-[1px]">
                          12:00pm - 4:00pm
                        </QuotesTime>
                      )}
                      <div>
                        <span className="border rounded-full text-xs px-2 py-1 text-grey-300 block w-min ml-auto">
                          {booking.status ?? "Pending"}
                        </span>
                        {isToday && idx === 0 && (
                          <span className="border rounded-full text-xs px-2 py-0.5 text-grey-300 block w-min mt-0.5 ml-auto bg-gray-200">
                            Recent
                          </span>
                        )}
                      </div>
                    </Row>
                    <Row className="justify-between items-center">
                      <Column className="gap-1">
                        <QuotesVehicle>
                          {booking.quote?.movingTruck}
                        </QuotesVehicle>
                        {typeof booking.quote?.averageRating === "number" && (
                          <QuotesRatings
                            rating={booking.quote?.averageRating}
                          />
                        )}
                      </Column>
                      {typeof booking.quote?.minimumAmount === "number" && (
                        <QuotesAmount amount={booking.quote?.minimumAmount} />
                      )}
                    </Row>
                  </QuotesContent>
                </Quotes>
              ))}
          </Row>
        </Column>
      </Column>
      <Column className="flex-1 sm:max-w-[500px] md:max-w-[350px] gap-8">
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          selected={date}
          onSelect={(date) => date && setDate(date)}
          disabled={(date: Date) => date < new Date("1900-01-01")}
          initialFocus
          className="rounded-xl shadow-custom bg-white-100 w-full"
        />
      </Column>
    </Row>
  );
};

export default Page;
