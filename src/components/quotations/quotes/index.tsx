import { cn, formatCurrency, truncateWithEllipsis } from "@/lib/utils";
import { FC, HTMLAttributes } from "react";
import { H, HeadingProps, P, Picture } from "../../atoms";
import { Column, Row } from "../../layout";
import { Stars, TruckFront } from "../../Icons";
import { generateDoodles } from "@/lib/helpers/generateDoodle";
import { Booking } from "@/types/structs";

interface QuotesImageProps {
  src: string;
  type: Booking["requestType"];
}

interface QuotesTitleProps extends HeadingProps {
  title: string;
}
const Quotes: FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => (
  <div
    {...props}
    className={cn(
      "flex flex-col gap-2 justify-between p-4 bg-white-100 shadow-sm rounded-xl flex-1 w-full max-w-[400px] sm:max-w-[270px] sm:min-w-[270px] lg:max-w-[270px] max-h-[350px] hover:cursor-pointer",
      props.className,
    )}
  />
);
const QuotesImage: FC<QuotesImageProps> = ({ type }) => {
  return (
    <div className="w-full h-[160px] flex-1 relative">
      <Picture
        container={{
          className: "w-full h-[160px] rounded-xl",
        }}
        image={{
          alt: "",
          src: "/images/move-company.jpeg",
          className: "object-cover rounded-xl",
        }}
      />
      <Picture
        container={{
          className:
            "absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[60px] h-[55px]",
        }}
        image={{
          alt: "",
          src:
            type === "RegularMove"
              ? "/images/book-move.png"
              : type === "Delivery"
              ? "/images/book-delivery.png"
              : "/images/hire-labor.png",
        }}
      />
    </div>
  );
};
const QuotesContent: FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => (
  <Column {...props} className={cn("gap-6 flex-1 pt-4", props.className)} />
);
const QuotesTitle: FC<QuotesTitleProps> = ({ ...props }) => (
  <H {...props} className={cn("text-primary text-base", props.className)}>
    {truncateWithEllipsis(props.title, 20)}
  </H>
);
const QuotesMovers: FC<HTMLAttributes<HTMLParagraphElement>> = ({
  ...props
}) => (
  <P
    {...props}
    className={cn(
      "text-grey-300 font-dm-sans text-sm p-0 m-0 leading-[8px]",
      props.className
    )}
  />
);
const QuotesVehicle: FC<HTMLAttributes<HTMLParagraphElement>> = ({
  ...props
}) => (
  <P
    {...props}
    className={cn(
      "text-grey-600 font-dm-sans text-sm font-bold",
      props.className
    )}
  />
);
const QuotesTime: FC<HTMLAttributes<HTMLParagraphElement>> = ({ ...props }) => (
  <P
    {...props}
    className={cn(
      "text-grey-600 font-dm-sans text-sm font-medium",
      props.className
    )}
  ></P>
);

const QuotesAmount = ({ amount }: { amount: number }) => (
  <div className="p-1 min-w-[80px] max-w-max text-center bg-primary rounded-3xl">
    <P className="font-dm-sans text-sm text-white-100">
      {formatCurrency(amount)}
    </P>
  </div>
);
const QuotesRatings = ({ rating }: { rating: number }) => {
  return (
    <Row className="items-center max-w-max">
      <Stars className="w-[43px] h-[11px]" />
      <P className="text-grey-600 font-bold font-dm-sans text-sm">{rating}</P>
    </Row>
  );
};
const QuotesMoversDoodles = ({ length }: { length: number }) => {
  const doodles = generateDoodles({ length });
  return (
    <Row className="relative">
      {doodles.map((item, index) => (
        <div
          key={item + index}
          className={cn(
            "w-[30px] h-[30px] p-[2px] rounded-full bg-white-100 border",
            {
              "relative mr-[-20px]": index !== length - 1,
            },
            `z-${index}`
          )}
        >
          <Picture
            container={{
              className: "w-full h-full rounded-full",
            }}
            image={{
              alt: "movers doodle",
              src: item,
              className: "rounded-full ",
            }}
          />
        </div>
      ))}
    </Row>
  );
};
const QuotesLabourActivity = ({ activity }: { activity: Array<string> }) => {
  return (
    <Row className="gap-1">
      {activity.map((item, index) => (
        <P className="font-dm-sans text-sm text-grey-600" key={item + index}>
          {item}
          {index !== activity.length - 1 && ","}
        </P>
      ))}
    </Row>
  );
};
const QuotesDistance = ({ distance }: { distance: string }) => (
  <Row className="items-center gap-1">
    <TruckFront />
    <P className="text-sm text-grey-600">{distance}Km</P>
  </Row>
);

export {
  Quotes,
  QuotesImage,
  QuotesContent,
  QuotesTitle,
  QuotesMovers,
  QuotesVehicle,
  QuotesTime,
  QuotesAmount,
  QuotesRatings,
  QuotesMoversDoodles,
  QuotesLabourActivity,
  QuotesDistance,
};
