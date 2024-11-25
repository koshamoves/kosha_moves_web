import { cn } from '@/lib/utils';
import React, { ChangeEvent, MouseEvent } from 'react';

interface Props {
  count?: string,
  className?: string,
  onChange: (num: string) => void,
}

// FIXME: should we be passing refs from react-hook-form to here? 
export const CountableInput: React.FC<Props> = ({ className, count: maybe_count, onChange }) => {
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

    // FIXME: there exists InputDirectives.numbersOnly. Take advantage of that?
    // either empty or a string of 1 or more digits 
    const is_valid = /^$|\d+\s*$/.test(str);
    if (!is_valid) return;

    onChange(str);
  }

  // TODO: switch to Kosha Moves Colours (is there a theme file somewhere?)
  const input_style = "flex-auto h-14 w-full rounded-xl border border-input bg-background px-6 py-4 text-base text-primary ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const btn_style = "flex-none border border-1 border-blue-500 hover:border-blue-700 text-white font-bold w-14 rounded";

  return (
    <div className="flex space-x-1" >
      <input
        className={cn(input_style, className)}
        value={count}
        placeholder="0"
        onChange={change}
      />

      {/* TODO: is there some way to have the elements hover over the input field? Does this look halfway decent on mobile? */}
      {/* FIXME: Mobile *works*, needs critique from UI designer */}
      <button className={btn_style} onClick={increment}>+</button>
      <button className={btn_style} onClick={decrement}>-</button>
    </div>
  );
}

