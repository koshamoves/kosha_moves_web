import * as React from "react";
import type { SVGProps } from "react";
import { memo } from "react";

interface Props extends SVGProps<SVGSVGElement> {
  invertcolor?: boolean;
}

const SvgGiftCard: React.FC<Props> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke={props.invertcolor ? "#FFFFFF" : "#A3AED0"}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M12 7V21M2 11H22M12 7c-1.5 0-3-1-3-2.5S10 2 12 4.5C14 2 16 3 15 4.5S13.5 7 12 7z" />
  </svg>
);

const Memo = memo(SvgGiftCard);
export default Memo;
