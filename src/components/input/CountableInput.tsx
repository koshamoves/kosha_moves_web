import { cn } from '@/lib/utils';
import { FC, ChangeEvent, MouseEvent } from 'react';

interface Props {
  count: string | undefined,
  style?: { button?: string, input?: string },
  onChange: (num: string) => void,
}

// FIXME: should we be passing refs from react-hook-form to here? Figure out later perhaps? 
export const CountableInput: FC<Props> = ({ style, count: maybe_count, onChange }) => {
  const count: string = maybe_count || "";

  // the invariant here is that we assume that count is a string that can be trivially
  // converted by the `+` operator.
  // 
  // note: `+""` is `0`
  // note: `+"12345       "` is `12345`

  const increment = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // don't want to check the other fields on click
    onChange(`${(+count) + 1}`);
  };

  const decrement = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let diff = (+count) - 1; // convert str to num 
    if (diff < 0) diff = 0;

    onChange(`${diff}`);
  };

  const change = (e: ChangeEvent<HTMLInputElement>) => {
    const str = e.target.value;

    // either empty or a string of 1 or more digits 
    const is_valid = /^$|\d+\s*$/.test(str);
    if (!is_valid) return;

    onChange(str);
  }

  const input_style = "min-w-[4.5em] flex-auto h-14 w-full rounded-xl border border-input bg-background px-6 py-4 text-base text-primary ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const btn_style = "flex-none self-center bg-secondary border text-white hover:text-white-500 hover:bg-primary font-bold aspect-square rounded";
  const btn_flex = "text-center"

  return (
    <div className="flex space-x-1" >
      <input
        className={cn(input_style, style?.input)}
        value={count}
        placeholder="0"
        onChange={change}
      />

      <button className={cn(btn_style, btn_flex, style?.button)} onClick={increment}>+</button>
      <button className={cn(btn_style, btn_flex, style?.button)} onClick={decrement}>-</button>
    </div>
  );
}

