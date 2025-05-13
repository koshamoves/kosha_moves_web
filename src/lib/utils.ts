import { type ClassValue, clsx } from "clsx";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateWithEllipsis = (text: string, maxLength: number) => {
  if (typeof text !== "string") {
    throw new TypeError("Expected a string as the first argument");
  }
  if (typeof maxLength !== "number" || maxLength < 0) {
    throw new TypeError(
      "Expected a non-negative number as the second argument",
    );
  }

  if (text.length > maxLength) return text.slice(0, maxLength - 3) + "...";
  return text;
};

export const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function mergeArrays(...arrays: any[]) {
  const length = arrays.reduce(
    (minLength, arr) => Math.min(minLength, arr.length),
    Infinity,
  );

  return Array.from({ length }, (_, index) =>
    arrays.reduce(
      (mergedObj, arr) => ({
        ...mergedObj,
        ...arr[index],
      }),
      {},
    ));
}

function abbreviateNumber(value: number): string {
  const suffixes = ["", "K", "M", "B", "T"];
  let suffixIndex = 0;
  let num = value;

  while (num >= 1000 && suffixIndex < suffixes.length - 1) {
    num /= 1000;
    suffixIndex++;
  }

  return `${num.toFixed(2)}${suffixes[suffixIndex]}`;
}

export function formatCurrency(
  value: number,
  locale: string = "en-US",
  currency: string = "USD",
): string {
  const formattedValue = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  if (value >= 1000000) {
    return abbreviateNumber(value);
  }

  return formattedValue;
}

export function trimTextAtPeriod(text: string) {
  const periodIndex = text.indexOf(".");
  if (periodIndex === -1) {
    return text;
  }
  return text.substring(0, periodIndex);
}
export const isValidDate = (dateString: unknown) => {
  const date = new Date(dateString as string);
  return !isNaN(date.getTime());
};

export const safeParseDate = (value: unknown): Date | null => {
  if (value instanceof Timestamp) return value.toDate();
  if (isValidDate(value)) return new Date(value as string);
  return null;
};

export type WithOptional<T, K extends keyof T> =
  & Omit<T, K>
  & Partial<Pick<T, K>>;
export type OptionalExcept<T, K extends keyof T> =
  & Partial<Omit<T, K>>
  & Pick<T, K>;


// TODO: rename
export const thing2 = <T extends object>(element: T): Required<T> => {
  for (const [key, value] of Object.entries(element)) {
    if (value == null) throw new Error(`Missing required field: ${key}`);
  }

  return element as Required<T>;
}

export function isWorseBoolean(str: string): asserts str is "Yes" | "No" {
  if (str !== "Yes" && str !== "No") {
    throw new Error(`Assertion Error: expected 'Yes' or 'No', was '${str}'`);
  }
}

export function isWorseOptionalBoolean(str: string): asserts str is "Yes" | "No" | "" {
  console.debug(`asserting that '${str}' is valid`);

  switch (str) {
    case "Yes":
    case "No":
    case "": return
    default:
      throw new Error(`Assertion Error: expected 'Yes', 'No', or ''. was '${str}`);
  }
}
