import React, { useState } from 'react';

interface TimePickerProps {
  onChange: (time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ onChange }) => {
  const [hour, setHour] = useState('');  
  const [minute, setMinute] = useState('');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value)) {
      setHour(value);
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value)) {
      setMinute(value);
    }
  };

  const togglePeriod = () => {
    setPeriod((prev) => (prev === 'AM' ? 'PM' : 'AM'));
  };

  const formatTime = () => {
    const formattedHour = String(Math.min(Math.max(parseInt(hour) || 0, 1), 12)).padStart(2, '0');
    const formattedMinute = String(Math.min(Math.max(parseInt(minute) || 0, 0), 59)).padStart(2, '0');
    setHour(formattedHour);
    setMinute(formattedMinute);
    onChange(`${formattedHour}:${formattedMinute} ${period}`);
  };

  return (
    <div className="flex items-center gap-2 p-2 border rounded-lg border-gray-300">
      {/* Hour Input */}
      <input
        type="text"
        value={hour}
        onChange={handleHourChange}
        onBlur={formatTime}  // Format the time after the user leaves the input
        className="w-12 text-center text-lg font-semibold bg-transparent focus:outline-none"
        maxLength={2}
        placeholder="HH"  // Placeholder for hour
      />

      <span className="text-lg font-semibold">:</span>

      {/* Minute Input */}
      <input
        type="text"
        value={minute}
        onChange={handleMinuteChange}
        onBlur={formatTime}  // Format the time after the user leaves the input
        className="w-12 text-center text-lg font-semibold bg-transparent focus:outline-none"
        maxLength={2}
        placeholder="MM"  // Placeholder for minute
      />

      {/* Period Toggle */}
      <div
        onClick={togglePeriod}
        className="cursor-pointer text-lg font-semibold text-blue-500"
      >
        {period}
      </div>
    </div>
  );
};

export default TimePicker;
