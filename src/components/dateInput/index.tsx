import { Calendar } from "../calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"
import { FC, ReactNode, MouseEvent, useRef } from "react"
import { ActiveModifiers } from "react-day-picker"
import { Close } from "@radix-ui/react-popover";

interface Props {
      field?: any;
      trigger: ReactNode;
}
export const DateInput: FC<Props> = ({ field, trigger }) => {
      const closeRef = useRef<HTMLButtonElement | null>(null);

      const handleSelect = (day: Date | undefined, selectedDay: Date, modifiers: ActiveModifiers, e: MouseEvent) => {
            field.onChange(day, selectedDay, modifiers, e);
            closeRef.current?.click();
      };

      return (
            <Popover>
                  <PopoverTrigger asChild>
                        {trigger}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={handleSelect}
                              disabled={(date) => date < new Date("1900-01-01")
                              }
                              initialFocus
                        />
                        <Close className="hidden" ref={closeRef} />
                  </PopoverContent>
            </Popover>
      )
}