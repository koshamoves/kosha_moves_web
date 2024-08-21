"use client";

import { useCallback, useState, type FC } from "react";
import { Button, Picture } from "../atoms";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Rating } from "./Rating";
import { useGetCompanyReviews } from "@/hooks/review";
import { Loader } from "lucide-react";
import { notFound } from "next/navigation";
import { useGetCompany } from "@/hooks/company";
import { safeParseDate } from "@/lib/utils";
import { format } from "date-fns";

const calculateAverageRating = (ratings: number[]) => {
  const total = ratings.reduce((acc, rating) => acc + rating, 0);
  const average = total / ratings.length;
  return +average.toFixed(1);
};
const ReviewModal: FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [review, setReview] = useState("");
  return (
    <Dialog open={open}>
      <DialogContent
        className="scrollbarless max-h-[95%] max-w-[95%] !overflow-y-auto sm:max-w-[500px] px-16 py-14 max-[450px]:px-6 max-[450px]:py-10"
        hideCloseButton
        onOverlayClick={onClose}
      >
        <DialogHeader>
          <DialogTitle className="text-center font-medium tracking-wide">
            Leave a Review for Tiyende movers
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-center">
          <p className="text-gray-700 text-xs">How would you rate your move?</p>
          <Rating
            editable
            iconClassName="scale-[1.4]"
            outlineIconClassName="stroke-[#0D0C22]"
          />
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Start writing..."
            className="mt-7 block min-h-28 w-full resize-y rounded-lg border-none p-3 bg-[#F6F6F6] text-sm"
          ></textarea>
        </div>
        <DialogFooter>
          <Button
            type="button"
            className="w-full h-8 font-normal tracking-wide rounded-full"
          >
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AllReviews: FC<{ companyId: string }> = ({ companyId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const onClose = useCallback(() => setModalOpen(false), []);
  const {
    isLoading: isLoadingReviews,
    data: reviews,
    error: reviewsError,
  } = useGetCompanyReviews(companyId);
  if (isLoadingReviews)
    return (
      <div className="flex justify-center pt-10 scale-125">
        <Loader className="animate-spin inline-block" />
      </div>
    );
  if ((!isLoadingReviews && reviewsError) || !reviews) {
    return (
      <p className="p-3 py-12 text-center text-red-400">
        {reviewsError?.cause
          ? reviewsError.message
          : "Could not fetch reviews. Kindly reload or try again later."}
      </p>
    );
  }
  const fiveStarRatings = reviews.filter((r) => r.rating === 5);
  const fourStarRatings = reviews.filter((r) => r.rating === 4);
  const threeStarRatings = reviews.filter((r) => r.rating === 3);
  const twoStarRatings = reviews.filter((r) => r.rating === 2);
  const oneStarRatings = reviews.filter((r) => r.rating === 1);

  const averageRating = calculateAverageRating(
    reviews.map((r) => r.rating ?? 0)
  );

  const ratings: Record<number, Record<"count" | "percentage", number>> = {
    5: {
      count: fiveStarRatings.length,
      percentage: (fiveStarRatings.length / reviews.length) * 100,
    },
    4: {
      count: fourStarRatings.length,
      percentage: (fourStarRatings.length / reviews.length) * 100,
    },
    3: {
      count: threeStarRatings.length,
      percentage: (threeStarRatings.length / reviews.length) * 100,
    },
    2: {
      count: twoStarRatings.length,
      percentage: (twoStarRatings.length / reviews.length) * 100,
    },
    1: {
      count: oneStarRatings.length,
      percentage: (oneStarRatings.length / reviews.length) * 100,
    },
  };
  return (
    <>
      <div>
        <div className="flex justify-between items-center flex-wrap gap-5 max-w-full">
          <div>
            <Select onValueChange={() => {}} defaultValue="newest">
              <SelectTrigger className="w-[429px] max-w-[calc(100vw-2rem)] border-none rounded-sm">
                <SelectValue placeholder="Sort" className="text-[#0D0C22]" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Sort by newest review</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button
              onClick={() => setModalOpen(true)}
              className="rounded-full w-[306px] max-w-[calc(100vw-2rem)] h-[2.25rem]"
            >
              Write a Review
            </Button>
          </div>
        </div>
        <div className="bg-white-100 rounded-md mt-6 px-[clamp(2rem,10vw,6rem)] py-6 flex justify-between items-center flex-wrap gap-6 max-w-full overflow-hidden">
          <div>
            <h3>Customer Reviews</h3>
            <p className="text-5xl font-bold my-3">{averageRating}</p>
            <Rating btnClassName="px-1 first:pl-0 mb-1" value={averageRating} />
            <p className="text-gray-400 text-sm">
              ({reviews?.length ?? 0} Reviews)
            </p>
          </div>
          <div className="space-y-2">
            {Object.entries(ratings)
              .reverse()
              .map(([key, value], idx) => {
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-[auto,1fr,auto] items-center justify-between gap-8 flex-wrap w-[600px] max-w-[calc(100vw-12rem)] max-[600px]:max-w-[calc(100vw-9rem)] max-[600px]:gap-4 text-sm"
                  >
                    <p className="whitespace-nowrap">{key} stars</p>
                    <div className="h-2 bg-[#F2F6FB] rounded-full p-0 mr-12 max-[600px]:mr-4">
                      <div
                        className="bg-[#E7B66B] h-full rounded-full"
                        style={{ width: `${value.percentage}%` }}
                      ></div>
                    </div>
                    <p>{value.count}</p>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="mt-4 bg-white-100 rounded-md pb-8">
          {reviews?.map((review) => {
            return (
              <div
                key={review.id}
                className="w-[700px] max-w-[calc(100vw-4rem)] mx-auto py-8 [&:not(:last-child)]:border-b last:pb-0"
              >
                <p className="text-sm text-gray-500">
                  {format(
                    safeParseDate(review.reviewDate) as Date,
                    "MMM dd, yyyy"
                  )}
                </p>
                <Rating
                  btnClassName="px-0.5 first:pl-0 mb-1"
                  className="inline-block my-1"
                  iconClassName="!scale-[.85]"
                  value={review.rating ?? 0}
                />
                <div className="flex flex-wrap gap-3 items-center">
                  <Picture
                    container={{ className: "w-10 h-10 rounded-full" }}
                    image={{
                      alt: "movers doodle",
                      src: "/images/green-doodle.png",
                      className: "rounded-full ",
                    }}
                  />
                  <h4 className="text-gray-800">{review.userName ?? "Anon"}</h4>
                </div>
                <p className="text-gray-700 mt-8 text-left">{review.comment}</p>
              </div>
            );
          })}
        </div>
      </div>
      <ReviewModal open={modalOpen} onClose={onClose} />
    </>
  );
};

export const CustomerReviews: FC<{ companyId: string }> = ({ companyId }) => {
  const {
    isLoading: isLoadingCompany,
    data: company,
    error: companyError,
  } = useGetCompany(companyId);
  if (isLoadingCompany)
    return (
      <div className="flex justify-center pt-10 scale-125">
        <Loader className="animate-spin inline-block" />
      </div>
    );
  if (!isLoadingCompany && companyError) {
    if (companyError.cause === 404) notFound();
    return (
      <p className="p-3 py-12 text-center text-red-400">
        {companyError?.cause
          ? companyError.message
          : "Could not get company information. Kindly reload or try again later."}
      </p>
    );
  }
  return <AllReviews companyId={companyId} />;
};
