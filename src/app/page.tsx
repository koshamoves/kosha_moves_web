"use client";
import { Activity, LeftColumn, RightColumn } from "@/components/activity";
import { Button, H, P, Picture } from "@/components/atoms";
import { Calendar } from "@/components/calendar";
import { Column, Row } from "@/components/layout";
import { MoveHistory } from "@/components/moveHistory";
import {
  Quotes,
  QuotesAmount,
  QuotesContent,
  QuotesImage,
  QuotesMovers,
  QuotesTime,
  QuotesTitle,
  QuotesVehicle,
  QuotesRatings,
} from "@/components/quotations/quotes";
import { Routes } from "@/core/routing";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { Booking, RequestType } from "@/types/structs";
import { useGetBookingsByDate } from "@/hooks/fireStore/useGetBookings";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { getAuth } from "firebase/auth";
import useBookingStore from "@/stores/booking.store";
import { useRouter } from "next/navigation";

const SEQUENCES: (Record<"route" | "icon" | "label", string> & {
  type: Booking["requestType"];
})[] = [
    {
      label: "Book a Move",
      route: Routes.sequence.bookMove,
      icon: "/images/book-move.png",
      type: RequestType.RegularMove,
    },
    {
      label: "Hire Labor",
      route: Routes.sequence.hireLabour,
      icon: "/images/hire-labor.png",
      type: RequestType.LabourOnly,
    },
    {
      label: "Book a Delivery",
      route: Routes.sequence.bookDelivery,
      icon: "/images/book-delivery.png",
      type: RequestType.Delivery,
    },
  ];

export default function Home() {
  const user = getAuth().currentUser;
  const router = useRouter();
  const [date, setDate] = useState<Date>(new Date());
  const { isLoading, data: bookings, error } = useGetBookingsByDate(date);
  const setSelectedBooking = useBookingStore.use.setSelectedBooking();

  const isToday =
    format(date, "MM-dd-yyyy") === format(new Date(), "MM-dd-yyyy");
  return (
    <Row className="gap-8 flex-col md:flex-row">
      <Column className="flex-1 gap-8">
        {/* {user && (
          <Activity>
            <LeftColumn>
              <H
                level={3}
                className="text-2xl md:text-3xl text-center md:text-left"
              >
                Delivery Quote received!
              </H>
              <P className="font-dm-sans text-sm text-center md:text-left">
                You have received an estimate for your delivery request
              </P>
              <Button className="bg-white-100 w-full md:max-w-[120px] text-primary">
                View
              </Button>
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
          </Activity>
        )} */}
        <Column className="gap-4">
          <H level={3} className="text-primary text-2xl">
            Select a Service
          </H>
          <Row className="flex-wrap">
            {SEQUENCES.map((item, index) => (
              <Link
                key={item.label + index}
                href={item.route}
                className="flex-1 group max-h-[120px] min-w-[200px] custom-496:max-w-[120px] sm:max-w-[250px]"
              >
                <div
                  key={item.label + index}
                  className="relative w-full h-[120px] bg-primary rounded-xl group-hover:scale-[1.01] transition-transform ease-linear duration-200"
                >
                  <div className="h-full relative">
                    <Picture
                      container={{
                        className: cn(
                          "w-[80px] h-[60px] relative right-0 absolute bottom-0",
                          {
                            "-right-4 w-[110px] h-[70px]": index === 2,
                          }
                        ),
                      }}
                      image={{
                        alt: "",
                        src: item.icon,
                      }}
                    />
                  </div>
                  <H
                    level={5}
                    className="absolute top-[50%] translate-y-[-50%] left-6 text-white-100 text-lg"
                  >
                    {item.label}
                  </H>
                </div>
              </Link>
            ))}
          </Row>
        </Column>
        {user && (
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
                bookings.slice(0, 3).map((booking, idx) => (
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
                          `${booking.requestType === RequestType.RegularMove
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
                              {booking.requestType === RequestType.RegularMove
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
        )}
      </Column>
      {user && (
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
          <Column className="bg-white-100 shadow-custom rounded-xl p-4 gap-8">
            <Column className="gap-2">
              <H level={3} className="m-0 p-0 text-primary font-bold text-2xl">
                Move History
              </H>
              <P className="m-0 p-0 text-primary-foreground">
                Here you can find all your transactions on this account and you
                can print them out as .pdf or .csv file
              </P>
            </Column>
            {/* <Column>
              <MoveHistory status="Pending" type="Hire labor" />
            </Column> */}
          </Column>
        </Column>
      )}
    </Row>
  );
}
