"use client";

import { H, P } from "@/components/atoms";
import { HireLabourSequence } from "@/components/forms/sequences";
import { SequencesLayout } from "@/components/layout/sequences";
import {
  Tabs,
  TabsContent,
  TabsCount,
  TabsList,
  TabsTrigger,
} from "@/components/tabs";
import { useEffect, useState } from "react";

const Page = () => {
  const [activeTab, setActiveTab] = useState<string>("dlt");
  useEffect(() => {
    document
      .querySelector("#layoutMainWrapper")
      ?.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  }, [activeTab]);
  return (
    <SequencesLayout>
      <H level={1} className="md:hidden text-center text-primary text-2xl my-6">
        {getMobileTitle(activeTab)}
      </H>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger className="flex gap-2 " value="dlt">
            <TabsCount count="1" isActive={activeTab === "dlt"} />
            <P className="hidden md:block">Date, Location & Time</P>
          </TabsTrigger>
          <TabsTrigger className="flex gap-2" value="itm">
            <TabsCount count="2" isActive={activeTab === "itm"} />
            <P className="hidden md:block">Additional Items</P>
          </TabsTrigger>
          <TabsTrigger className="flex gap-2" value="generalInfo">
            <TabsCount count="3" isActive={activeTab === "generalInfo"} />
            <P className="hidden md:block"> Service Requirements</P>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dlt">
          <HireLabourSequence.Step1
            onChangeStep={(next) => setActiveTab(next ?? "")}
          />
        </TabsContent>
        <TabsContent value="itm">
          <HireLabourSequence.Step2
            onChangeStep={(next) => setActiveTab(next ?? "")}
          />
        </TabsContent>
        <TabsContent value="generalInfo">
          <HireLabourSequence.Step3
            onChangeStep={(next) => setActiveTab(next ?? "")}
          />
        </TabsContent>
      </Tabs>
    </SequencesLayout>
  );
};

const getMobileTitle = (active: string): string => {
  switch (active) {
    case "dlt":
      return "Date, Location & Time";
      break;
    case "itm":
      return "Additional Items";
      break;
    case "generalInfo":
      return "Service Requirements";
      break;
    default:
      return "";
      break;
  }
};
export default Page;

