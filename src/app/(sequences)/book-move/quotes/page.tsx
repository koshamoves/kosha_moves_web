"use client";
import { Column, Row } from "@/components/layout";
import { Quotations } from "@/components/quotations";
import {
  Quotes,
  QuotesAmount,
  QuotesContent,
  QuotesImage,
  QuotesMovers,
  QuotesMoversDoodles,
  QuotesRatings,
  QuotesTitle,
  QuotesVehicle,
} from "@/components/quotations/quotes";
import useQuoteDetailsStore from "@/stores/quote-details.store";
import { Routes } from "@/core/routing";
import useShowQuotes from "@/stores/show-quotes.store";
import { Quote, RequestType } from "@/types/structs";
import { useRouter } from "next/navigation";
import { CircleAlert } from "lucide-react";
import useBookingStore from "@/stores/booking.store";
import { P } from "@/components/atoms";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const selectedBooking = useBookingStore.use.selectedBooking();
  const router = useRouter();

  const replaceQuoteDetails = useQuoteDetailsStore((state) => state.replace);

  const { quotesResult } = useShowQuotes((state) => state);
  const updating = searchParams.get("action") === "update";

  if (!selectedBooking && updating) {
    return (
      <Row className="w-full h-full items-center justify-center">
        <Column className="items-center justify-center max-w-max gap-4">
          <CircleAlert className="textPrimary" />
          <P className="text-primary text-base">No booking selected</P>
          <Link href={Routes.bookings} className="border p-2 px-4 rounded-sm">
            <P className="text-grey-300 text-sm border-primary-foreground">
              See your bookings
            </P>
          </Link>
        </Column>
      </Row>
    );
  }
  return (
    <>
      <Quotations<Quote>
        list={quotesResult}
        renderItem={({ index, item }) => {
          return (
            <Quotes
              onClick={() => {
                replaceQuoteDetails(item);

                router.push(
                  `${Routes.bookMoveQuoteDetails}${updating ? "?action=update" : ""
                  }`
                );
              }}
              key={item.companyName + index}
            >
              <QuotesImage src="" type={RequestType.RegularMove} />
              <QuotesContent>
                <Row className="items-start justify-between gap-6 flex-wrap">
                  <Column>
                    <QuotesTitle title={item.companyName} />
                    <QuotesMovers>{item.movers} Movers</QuotesMovers>
                  </Column>
                  <QuotesMoversDoodles length={item.movers} />
                </Row>
                <Row className="justify-between items-center">
                  <Column className="gap-1">
                    <QuotesVehicle>{item.movingTruck}</QuotesVehicle>
                    <QuotesRatings rating={item.averageRating} />
                  </Column>
                  <QuotesAmount amount={item.minimumAmount} />
                </Row>
              </QuotesContent>
            </Quotes>
          )
        }}
      />
    </>
  );
};

export default Page;
