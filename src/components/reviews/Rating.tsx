import { FC, ComponentProps, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { StarIcon } from "lucide-react";

const ratingStyles = (className?: string) =>
  cva(twMerge("flex flex-wrap items-center justify-center", className ?? ""), {
    variants: {},
    defaultVariants: {},
  });

export interface RatingProps
  extends ComponentProps<"div">,
    VariantProps<ReturnType<typeof ratingStyles>> {
  // ! isOpen and close props are required
  numberOfStars?: number;
  onRatingChange?: (val: number) => void;
  value?: number;
  editable?: boolean;
  btnClassName?: string;
  iconClassName?: string;
  solidIconClassName?: string;
  outlineIconClassName?: string;
}

export const Rating: FC<RatingProps> = ({
  className,
  numberOfStars,
  onRatingChange,
  value,
  editable = false,
  btnClassName,
  iconClassName,
  solidIconClassName,
  outlineIconClassName,
}) => {
  const [defaultNumberOfStars] = useState(5);
  const [rating, setRating] = useState(0);
  const [mouseOver, setMouseOver] = useState<number | null>(null);
  return (
    <>
      <div className={ratingStyles(className)({})}>
        {new Array(numberOfStars ?? defaultNumberOfStars)
          .fill("")
          .map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => {
                if (!editable) return;
                setRating(idx + 1);
                onRatingChange && onRatingChange(idx + 1);
              }}
              onMouseEnter={() => editable && setMouseOver(idx + 1)}
              onMouseLeave={() => editable && setMouseOver(null)}
              className={twMerge(
                "px-3 py-1 max-[440px]:px-1",
                !editable && "cursor-auto",
                btnClassName
              )}
            >
              {(value ?? rating) > idx ? (
                <StarIcon
                  className={twMerge(
                    "max-[440px]:scale-75 stroke-[#E7B66B] stroke-1 fill-[#E7B66B]",
                    iconClassName,
                    solidIconClassName
                  )}
                />
              ) : mouseOver && mouseOver > idx ? (
                <StarIcon
                  className={twMerge(
                    "max-[440px]:scale-75 stroke-[#E7B66B] stroke-1 fill-[#E7B66B]",
                    iconClassName,
                    solidIconClassName
                  )}
                />
              ) : (
                <StarIcon
                  className={twMerge(
                    "max-[440px]:scale-75 stroke-[#E7B66B] stroke-1 fill-none",
                    iconClassName,
                    outlineIconClassName
                  )}
                />
              )}
            </button>
          ))}
      </div>
    </>
  );
};
