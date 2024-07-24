import type { FC } from "react";
import Link from "next/link";
import { P, Picture } from "../atoms";
import { Column, Row } from "../layout";
import { cn, safeParseDate } from "@/lib/utils";
import { Routes } from "@/core/routing";
import { useParams } from "next/navigation";
import { useGetChats } from "@/hooks/messages";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export const ChatList: FC<{ closeList: () => void }> = ({ closeList }) => {
  const { data, isLoading } = useGetChats();
  const type = "Book a move";
  const params = useParams();
  return (
    <Column className="gap-0 h-full w-full">
      {isLoading && (
        <div className="space-y-2 px-4">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      )}
      {!isLoading && data && data.length === 0 && (
        <Column className="justify-center items-center gap-4 h-full w-full">
          <Picture
            container={{
              className: "w-[200px] h-[150px]",
            }}
            image={{
              alt: "",
              src: "/images/chat-bg.png",
            }}
          />
          <Column className="items-center gap-1">
            <P className="text-grey-300 font-bold text-xl">
              No conversation yet
            </P>
            <P className="text-grey-200">Book to have conversations</P>
          </Column>
        </Column>
      )}
      {!isLoading &&
        data &&
        data.map((chat) => (
          <Link
            href={`${Routes.messages}/${chat.id}`}
            key={chat.id!}
            onClick={closeList}
          >
            <Row
              className={cn("items-center justify-between p-4 bg-transparent", {
                "bg-white-100 shadow-sm rounded-l-xl": params.slug === chat.id,
              })}
            >
              <Row className="items-center flex-1">
                <div className="max-w-[50px] h-[50px] flex-1 relative">
                  <div className="w-full h-full rounded-xl bg-slate-700"></div>
                  <Picture
                    container={{
                      className:
                        "absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[35px] h-[35px]",
                    }}
                    image={{
                      alt: "",
                      src:
                        type === "Book a move"
                          ? "/images/book-move.png"
                          : type === "Book a delivery"
                          ? "/images/book-delivery.png"
                          : "/images/hire-labor.png",
                    }}
                  />
                </div>
                <Column className="flex-1 gap-0">
                  <P className="font-dm-sans text-primary font-bold text-sm leading-[16px]">
                    {chat.quote?.companyName}
                  </P>
                  <P className="font-dm-sans text-primary-foreground text-xs">
                    {chat.bookingDate &&
                      format(
                        safeParseDate(chat.bookingDate) as Date,
                        "MMM dd, yyyy"
                      )}
                  </P>
                </Column>
              </Row>
              <Column className="items-center">
                <P className="text-sm text-grey-100 font-dm-sans">
                  {chat.bookingDate
                    ? format(safeParseDate(chat.bookingDate) as Date, "HH:mm")
                    : ""}
                </P>
                {!!NaN && (
                  <span className="bg-orange-100 min-w-[1.2rem] min-h-[1.2rem] p-[2px] rounded-full text-white-100 text-center flex items-center justify-center">
                    <p className="text-xs text-center">3</p>
                  </span>
                )}
              </Column>
            </Row>
          </Link>
        ))}
    </Column>
  );
};
