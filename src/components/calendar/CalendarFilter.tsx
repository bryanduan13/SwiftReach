
import React from 'react';
import { Check, Square } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface CalendarFilterProps {
  filters: {
    showing: boolean;
    meeting: boolean;
    'open-house': boolean;
    call: boolean;
  };
  onFilterChange: (key: string, value: boolean) => void;
}

export const CalendarFilter = ({ filters, onFilterChange }: CalendarFilterProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="font-medium mb-1">Filter Events</h3>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="showing-filter"
          checked={filters.showing}
          onCheckedChange={(checked) => onFilterChange('showing', !!checked)}
        />
        <label
          htmlFor="showing-filter"
          className="text-sm font-medium flex items-center"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
          Property Showings
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="meeting-filter"
          checked={filters.meeting}
          onCheckedChange={(checked) => onFilterChange('meeting', !!checked)}
        />
        <label
          htmlFor="meeting-filter"
          className="text-sm font-medium flex items-center"
        >
          <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
          Meetings
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="openhouse-filter"
          checked={filters['open-house']}
          onCheckedChange={(checked) => onFilterChange('open-house', !!checked)}
        />
        <label
          htmlFor="openhouse-filter"
          className="text-sm font-medium flex items-center"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          Open Houses
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="call-filter"
          checked={filters.call}
          onCheckedChange={(checked) => onFilterChange('call', !!checked)}
        />
        <label
          htmlFor="call-filter"
          className="text-sm font-medium flex items-center"
        >
          <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
          Calls
        </label>
      </div>
    </div>
  );
};

export default CalendarFilter;
