import * as React from "react";
import { cva } from 'class-variance-authority';
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-xl border border-input bg-background px-6 py-4 text-base text-primary ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const inputStyles = (className?: string) =>
  cva(
    cn(
      `block w-full rounded-md border p-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-inset focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-blue-300 sm:text-sm sm:leading-6 ${className ?? ""
      }`
    ),
    {
      variants: {},
    }
  );

export const DebouncedInput = React.forwardRef<
  HTMLInputElement,
  {
    debounce?: number;
  } & InputProps
>(
  (
    { onChange, debounce = 800, className, value: initialValue, ...props },
    ref
  ) => {
    const [value, setValue] = React.useState(initialValue);
    const timerRef = React.useRef<NodeJS.Timeout>();
    return (
      <input
        ref={ref}
        value={value}
        className={inputStyles(className)({})}
        {...props}
        onChange={(...arg) => {
          setValue(arg[0].target.value);
          clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            onChange && onChange(...arg);
          }, debounce);
        }}
      />
    );
  }
);
DebouncedInput.displayName = "DebouncedInput";
export { Input };

interface DebouncedInputProps {
  onInputSettled: (str: string) => void,
  timeout?: number,
}

type DiscountInputProps = React.InputHTMLAttributes<HTMLInputElement> & DebouncedInputProps;

/// Custom Debounced Input
export const DiscountInput = React.forwardRef<HTMLInputElement, DiscountInputProps>((props, ref) => {
  const [value, setValue] = React.useState("");
  const timer = React.useRef<NodeJS.Timeout>();
  const defaultTimeout = 800; // ms

  return (
    <input
      {...props}

      ref={ref}
      value={value}
      className={inputStyles(props.className)({})}
      onChange={(e) => {
        const str = e.target.value;

        // empty, and <= 6 digit numbers only
        const isValid = /^$|^\w{0,6}\s*$/.test(str);
        if (!isValid) return;

        setValue(str);
        clearTimeout(timer.current);

        timer.current = setTimeout(() => {
          props.onInputSettled(str);
        }, props.timeout ?? defaultTimeout);
      }}
    />
  );
});
DiscountInput.displayName = "DiscountInput";