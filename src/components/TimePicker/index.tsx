import React, { useState } from 'react';
import { format, parse } from 'date-fns';
import DatePicker from 'react-datepicker';
import { Input } from '../input';

import "react-datepicker/dist/react-datepicker.css";
import { ControllerRenderProps } from 'react-hook-form';

interface TimePickerProps {
  field: ControllerRenderProps<any, any>;
}

const TimePicker: React.FC<TimePickerProps> = ({ field }) => {
  const [time, setTime] = useState<Date>(parse(field.value, "kk:mm:ss", new Date()));

  const handleOnChange = (date: Date | null): void => {
    if (date == null) return;

    setTime(date)
    field.onChange(format(date, "kk:mm:ss"));
  }

  return (
    <DatePicker
      selected={time}
      onChange={handleOnChange}
      showTimeSelect
      showTimeSelectOnly
      customInput={<Input />}
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="h:mm aa"
    />
  );
}

export default TimePicker;
