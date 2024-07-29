import * as React from "react";
import type { SVGProps } from "react";
import { memo } from "react";
const SvgBookingTime = (props: SVGProps<SVGSVGElement>) => (
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
      d="M23.75 18.858a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.398-3.078 1.092-.695.694-.977 1.64-1.093 3.078h19.842c-.115-1.439-.398-2.384-1.093-3.078-.694-.694-1.639-.977-3.078-1.092v-1.58a.75.75 0 0 0-1.5 0v1.513c-.665-.013-1.411-.013-2.25-.013h-4c-.839 0-1.585 0-2.25.013z"
    />
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M18 28.358c0-.839 0-1.584.013-2.25h19.974c.013.666.013 1.411.013 2.25v2c0 3.772 0 5.657-1.172 6.829S33.771 38.358 30 38.358h-4c-3.771 0-5.657 0-6.828-1.171S18 34.13 18 30.358zm15 2a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-4-5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-6-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgBookingTime);
export default Memo;
