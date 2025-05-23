import { Calendar } from "../calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"
import { FC, ReactNode } from "react"

interface Props {
      field?: any;
      trigger: ReactNode;
}
export const DateInput: FC<Props> = ({ field, trigger }) => {
      return (
            <Popover>
                  <PopoverTrigger asChild>
                        {trigger}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date("1900-01-01")
                              }
                              initialFocus
                        />
                  </PopoverContent>
            </Popover>
      )
}