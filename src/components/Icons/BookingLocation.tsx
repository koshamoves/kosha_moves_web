import * as React from "react";
import type { SVGProps } from "react";
import { memo } from "react";
const SvgBookingLocation = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 56 57"
    {...props}
  >
    <circle cx={28} cy={28.358} r={28} fill="#27446E" />
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M28 18.358c-4.418 0-8 4.003-8 8.5 0 4.463 2.553 9.313 6.537 11.175a3.45 3.45 0 0 0 2.926 0C33.447 36.17 36 31.32 36 26.858c0-4.497-3.582-8.5-8-8.5m0 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgBookingLocation);
export default Memo;
