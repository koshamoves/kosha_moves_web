"use client";
import { H, P } from "@/components/atoms";
import { BookMoveSequence } from "@/components/forms/sequences";
import { SequencesLayout } from "@/components/layout/sequences";
import {
  Tabs,
  TabsContent,
  TabsCount,
  TabsList,
  TabsTrigger,
} from "@/components/tabs";
import { useEffect, useState } from "react";
import useBookingStore from "@/stores/booking.store";
import { CircleAlert } from "lucide-react";
import { Column, Row } from "@/components/layout";
import Link from "next/link";
import { Routes } from "@/core/routing";
import { useSearchParams } from "next/navigation";
import useBookMoveStore from "@/stores/book-move.store";

const Page = () => {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const isTakingAction = ["update", "finish"].includes(action ?? "");
  const updating = searchParams.get("action") === "update";
  const [activeTab, setActiveTab] = useState<string>("dateAndTime");
  const selectedBooking = useBookingStore.use.selectedBooking();
  const [isMounted, setIsMounted] = useState(false);
  const resetBookMoveStore = useBookMoveStore((state) => state.reset);

  useEffect(() => {
    if (!isTakingAction) {
      resetBookMoveStore();
    }
    setIsMounted(true);
  }, [isTakingAction, resetBookMoveStore]);

  useEffect(() => {
    document
      .querySelector("#layoutMainWrapper")
      ?.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  }, [activeTab]);

  if (!isMounted) return null;
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
    <SequencesLayout>
      <H level={1} className="md:hidden text-center text-primary text-2xl my-6">
        {getMobileTitle(activeTab)}
      </H>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger className="flex gap-2" value="dateAndTime">
            <TabsCount count="1" isActive={activeTab === "dateAndTime"} />
            <P className="hidden md:block">Date & Time</P>
          </TabsTrigger>
          <TabsTrigger className="flex gap-2" value="propertyDetail">
            <TabsCount count="2" isActive={activeTab === "propertyDetail"} />
            <P className="hidden md:block">Property Detail</P>
          </TabsTrigger>
          <TabsTrigger className="flex gap-2" value="generalInfo">
            <TabsCount count="3" isActive={activeTab === "generalInfo"} />
            <P className="hidden md:block">Additional Info</P>
          </TabsTrigger>
          <TabsTrigger className="flex gap-2" value="serviceRequirement">
            <TabsCount
              count="4"
              isActive={activeTab === "serviceRequirement"}
            />
            <P className="hidden md:block">Service Requirement</P>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dateAndTime">
          <BookMoveSequence.Step1
            onChangeStep={(next) => setActiveTab(next ?? "")}
          />
        </TabsContent>
        <TabsContent value="propertyDetail">
          <BookMoveSequence.Step2
            onChangeStep={(next) => setActiveTab(next ?? "")}
          />
        </TabsContent>
        <TabsContent value="generalInfo">
          <BookMoveSequence.Step3
            onChangeStep={(next) => setActiveTab(next ?? "")}
          />
        </TabsContent>
        <TabsContent value="serviceRequirement">
          <BookMoveSequence.Step4
            onChangeStep={(next) => setActiveTab(next ?? "")}
          />
        </TabsContent>
      </Tabs>
    </SequencesLayout>
  );
};

const getMobileTitle = (active: string): string => {
  switch (active) {
    case "dateAndTime":
      return "Schedule a Move";
      break;
    case "propertyDetail":
      return "Pickup Details";
      break;
    case "generalInfo":
      return "Additional Info";
      break;
    case "serviceRequirement":
      return "Service Requirements";
      break;
    default:
      return "";
      break;
  }
};

export default Page;
