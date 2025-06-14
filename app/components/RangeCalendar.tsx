"use client";
import React, { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";

interface DateRange {
  start: Dayjs | null;
  end: Dayjs | null;
}
interface RangeCalendarProps {
  className?: string;
  onDateSelected: (range: { start: Date | null; end: Date | null }) => void;
  preselectedRange?: { start: Date | null; end: Date | null };
}
const RangeCalendar: React.FC<RangeCalendarProps> = ({
  className,
  onDateSelected,
  preselectedRange,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [hoveredDate, setHoveredDate] = useState<Dayjs | null>(null);
  const limitDays = 13; // days - 1
  useEffect(() => {
    if (preselectedRange) {
      setSelectedRange({
        start: preselectedRange.start ? dayjs(preselectedRange.start) : null,
        end: preselectedRange.end ? dayjs(preselectedRange.end) : null,
      });
    }
  }, [preselectedRange]);

  const daysOfWeek: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const today = dayjs();

  const startOfMonth = currentMonth.startOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = currentMonth.daysInMonth();

  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  const handleDateClick = (date: Dayjs) => {
    if (date.isBefore(today, "day")) return;

    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: date, end: null });
    } else if (selectedRange.start && !selectedRange.end) {

      const limitDate = selectedRange.start ? selectedRange.start.add(limitDays, 'day') : null;
      const limitDateMinus = selectedRange.start ? selectedRange.start.subtract(limitDays, 'day') : null;
      const withinLimit = selectedRange.start ? (date.isBefore(limitDate) && date.isAfter(limitDateMinus)) : true;
      

      if (date.isBefore(selectedRange.start, "day")) {
        setSelectedRange({ start: date, end: selectedRange.start });
      }
      
      const newRange = {
        start: date.isBefore(selectedRange.start, "day") && withinLimit ? date : date.isBefore(selectedRange.start, "day") && !withinLimit ? limitDateMinus : selectedRange.start,
        end: date.isAfter(selectedRange.start, "day") && withinLimit ? date : date.isAfter(selectedRange.start, "day") && !withinLimit ? limitDate : selectedRange.start,
      };
      setSelectedRange(newRange);
      onDateSelected({
        start: newRange.start?.toDate() || null,
        end: newRange.end?.toDate() || null,
      });
    }
  };

  const handleMouseEnter = (date: Dayjs) => {
    setHoveredDate(date);
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  const isInRange = (date: Dayjs): boolean => {
    const { start, end } = selectedRange;
    if (start && !end && hoveredDate) {
      return (
        (hoveredDate.isAfter(start, "day") &&
          date.isAfter(start, "day") &&
          date.isBefore(hoveredDate, "day")) ||
        (hoveredDate.isBefore(start, "day") &&
          date.isBefore(start, "day") &&
          date.isAfter(hoveredDate, "day"))
      );
    }
    return !!(start && end && date.isAfter(start, "day") && date.isBefore(end, "day"));
  };

  const isSelected = (date: Dayjs): boolean => {
    const { start, end } = selectedRange;
    return !!(
      (start && date.isSame(start, "day")) ||
      (end && date.isSame(end, "day"))
    );
  };

  const renderDays = () => {
    const days: React.ReactNode[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const currentDate = currentMonth.date(d);
      const selected = isSelected(currentDate);
      const inRange = isInRange(currentDate);
      const isDisabled = currentDate.isBefore(today, "day");
      const limitDate = selectedRange.start ? selectedRange.start.add(limitDays, 'day') : null;
      const limitDateMinus = selectedRange.start ? selectedRange.start.subtract(limitDays, 'day') : null;
      const withinLimit = selectedRange.start ? (currentDate.isBefore(limitDate) && currentDate.isAfter(limitDateMinus)) : true;
      
      days.push(
        <button
          key={d}
          onClick={() => handleDateClick(currentDate)}
          onMouseEnter={() => handleMouseEnter(currentDate)}
          onMouseLeave={handleMouseLeave}
          disabled={isDisabled}
          className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-full transition-all
            ${
              selected
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                : (inRange && withinLimit)
                ? "bg-blue-100"
                : isDisabled
                ? "text-gray-400 cursor-not-allowed"
                : withinLimit 
                ? "hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-300"
                :""
              }`}
        >
          {d}
        </button>
      );
    }

    return days;
  };

  return (
    <div
      className={`bg-white border rounded-[25px] border-gray-300 flex flex-col items-center justify-center p-6 shadow-lg ${className}`}
      style={{ width: "100%" }}
    >
      <div className="flex items-center justify-between w-full mb-4">
        <button
          onClick={prevMonth}
          aria-label="Previous Month"
          disabled={currentMonth.isSame(today, "month")}
          className="p-2 rounded-full hover:bg-gray-200 cursor-pointer disabled:opacity-50"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            viewBox="0 0 16 16"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M10 3.33334L6 8.00001L10 12.6667" />
          </svg>
        </button>
        <span className="text-lg font-semibold text-gray-800">
          {currentMonth.format("MMMM YYYY")}
        </span>
        <button
          onClick={nextMonth}
          aria-label="Next Month"
          className="p-2 rounded-full cursor-pointer hover:bg-gray-200"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            viewBox="0 0 16 16"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 3.33334L10 8.00001L6 12.6667" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2 text-gray-500 text-sm w-full text-center">
        {daysOfWeek.map((day) => (
          <div key={day} className="font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 w-full text-sm">{renderDays()}</div>

      <div className="mt-4 text-xs text-gray-600 text-center">
        {selectedRange.start && (
          <span>Start: {selectedRange.start.format("DD MMM YYYY")}</span>
        )}
        {selectedRange.end && (
          <span> → End: {selectedRange.end.format("DD MMM YYYY")}</span>
        )}
      </div>
    </div>
  );
};

export default RangeCalendar;
