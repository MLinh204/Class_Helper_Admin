import React from 'react';

type ScheduleDateDisplayProps = {
  scheduleDate: string | string[] | null;
};

const ScheduleDateDisplay: React.FC<ScheduleDateDisplayProps> = ({ scheduleDate }) => {
  // Convert scheduleDate to array regardless of input format
  const getDaysArray = () => {
    if (!scheduleDate) return [];
    
    // If it's already an array, return it
    if (Array.isArray(scheduleDate)) return scheduleDate;
    
    // If it's a string, check if it contains day names
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const containsDayNames = dayNames.some(day => scheduleDate.includes(day));
    
    // If it contains day names, split by commas
    if (containsDayNames) {
      return scheduleDate.split(',').map(day => day.trim());
    }
    
    // If it's just a date or another format, return as single item
    return [scheduleDate];
  };

  const days = getDaysArray();
  
  if (days.length === 0) {
    return <span className="text-gray-400 italic">No schedule set</span>;
  }

  // Check if days contain actual day names
  const isDayName = (day: string) => {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return dayNames.some(name => day.includes(name));
  };

  // If not day names, just return the schedule date as is
  if (!days.some(isDayName)) {
    return <span>{scheduleDate}</span>;
  }

  // Sort days in week order
  const dayOrder = {
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
    'Sunday': 7
  };

  const sortedDays = [...days].sort((a, b) => {
    const aOrder = Object.keys(dayOrder).find(day => a.includes(day));
    const bOrder = Object.keys(dayOrder).find(day => b.includes(day));
    return (aOrder ? dayOrder[aOrder as keyof typeof dayOrder] : 0) - 
           (bOrder ? dayOrder[bOrder as keyof typeof dayOrder] : 0);
  });

  return (
    <div className="flex flex-wrap gap-1">
      {sortedDays.map((day, index) => (
        <span 
          key={`${day}-${index}`}
          className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
        >
          {isDayName(day) ? day.substring(0, 3) : day}
        </span>
      ))}
    </div>
  );
};

export default ScheduleDateDisplay;