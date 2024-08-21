"use client";

import { CustomerReviews } from "@/components/reviews/CustomerReviews";
import { useParams } from "next/navigation";

export default function Reviews() {
  const params = useParams<{ companyId: string }>();
  return (
    <>
      <CustomerReviews companyId={params.companyId} />
    </>
  );
}
