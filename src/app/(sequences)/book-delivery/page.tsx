"use client";
import { H, P } from "@/components/atoms";
import { BookDeliverySequence } from "@/components/forms/sequences";
// import { Column, Row } from "@/components/layout";
import { SequencesLayout } from "@/components/layout/sequences";
// import { Quotations } from "@/components/quotations";
// import {
//   Quotes,
//   QuotesAmount,
//   QuotesContent,
//   QuotesDistance,
//   QuotesImage,
//   QuotesRatings,
//   QuotesTime,
//   QuotesTitle,
// } from "@/components/quotations/quotes";
import {
  Tabs,
  TabsContent,
  TabsCount,
  TabsList,
  TabsTrigger,
} from "@/components/tabs";
import useBookDeliveryStore from "@/stores/book-delivery.store";
// import { BookDeliveryMock } from "@/mocks";
import useShowQuotes from "@/stores/show-quotes.store";
import { useSearchParams } from "next/navigation";
// import { DeliveryQuote } from "@/types/structs";
import { useEffect, useState } from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const isTakingAction = ["update", "finish"].includes(action ?? "");
  const showQuote = useShowQuotes((state) => state.showQuote);
  const [activeTab, setActiveTab] = useState<string>("dlt");
  const [isMounted, setIsMounted] = useState(false);
  const resetBookDeliveryStore = useBookDeliveryStore((state) => state.reset);
  useEffect(() => {
    document
      .querySelector("#layoutMainWrapper")
      ?.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  }, [activeTab]);
  useEffect(() => {
    if (!isTakingAction) {
      resetBookDeliveryStore();
    }
    setIsMounted(true);
  }, [isTakingAction, resetBookDeliveryStore]);
  if (!isMounted) return null;
  return (
    <>
      {!showQuote && (
        <SequencesLayout>
          <H
            level={1}
            className="md:hidden text-center text-primary text-2xl my-6"
          >
            {getMobileTitle(activeTab)}
          </H>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger className="flex gap-2" value="dlt">
                <TabsCount count="1" isActive={activeTab === "dlt"} />
                <P className="hidden md:block">Date, Location & Time</P>
              </TabsTrigger>
              <TabsTrigger className="flex gap-2" value="pld">
                <TabsCount count="2" isActive={activeTab === "pld"} />
                <P className="hidden md:block">Pickup Location Details</P>
              </TabsTrigger>
              <TabsTrigger className="flex gap-2" value="itu">
                <TabsCount count="3" isActive={activeTab === "itu"} />
                <P className="hidden md:block">Items to Pick up</P>
              </TabsTrigger>
              <TabsTrigger className="flex gap-2" value="serviceRequirement">
                <TabsCount
                  count="4"
                  isActive={activeTab === "serviceRequirement"}
                />
                <P className="hidden md:block">Add-on Services</P>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="dlt">
              <BookDeliverySequence.Step1
                onChangeStep={(next) => setActiveTab(next ?? "")}
              />
            </TabsContent>
            <TabsContent value="pld">
              <BookDeliverySequence.Step2
                onChangeStep={(next) => setActiveTab(next ?? "")}
              />
            </TabsContent>
            <TabsContent value="itu">
              <BookDeliverySequence.Step3
                onChangeStep={(next) => setActiveTab(next ?? "")}
              />
            </TabsContent>
            <TabsContent value="serviceRequirement">
              <BookDeliverySequence.Step4
                onChangeStep={(next) => setActiveTab(next ?? "")}
              />
            </TabsContent>
          </Tabs>
        </SequencesLayout>
      )}
      {/* <Quotations<DeliveryQuote> 
                        list={BookDeliveryMock}
                        renderItem={({index, item}) => (
                              <Quotes key={item.name + index} className="min-w-[270px]">
                                    <QuotesImage src="" type="Book a delivery" />
                                    <QuotesContent>
                                          <Row className="items-start justify-between gap-6 flex-wrap">
                                                <Column>
                                                      <QuotesTitle title={item.name} />
                                                      <QuotesRatings rating={item.rating}/>
                                                </Column>
                                                <QuotesDistance distance={item.distance} />
                                          </Row>
                                          <Row className="justify-between items-center">
                                                <QuotesTime className="mt-[4px]" >{item.time}</QuotesTime>
                                                <QuotesAmount amount={item.amount}/>
                                          </Row>
                                    </QuotesContent>
                              </Quotes>
                        )}
                  /> */}
    </>
  );
};

const getMobileTitle = (active: string): string => {
  switch (active) {
    case "dlt":
      return "Date, Location & Time";
      break;
    case "pld":
      return "Pickup Location Details";
      break;
    case "itu":
      return "Items to Pick up";
      break;
    case "serviceRequirement":
      return "Add-on Services";
      break;
    default:
      return "";
      break;
  }
};

export default Page;
