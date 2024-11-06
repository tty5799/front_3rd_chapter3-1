import React from 'react';
import { Heading, HStack, IconButton, Select, VStack } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import WeekView from './WeekView.tsx';
import MonthView from './MonthView.tsx';
import { useCalendarView } from '../../hooks/useCalendarView.ts';
import { useSearch } from '../../hooks/useSearch.ts';
import { useNotifications } from '../../hooks/useNotifications.ts';
import { useEventOperations } from '../../hooks/useEventOperations.ts';
import { useEventForm } from '../../hooks/useEventForm.ts';

const Calender: React.FC = () => {
  const { editingEvent, setEditingEvent } = useEventForm();
  const { events } = useEventOperations(Boolean(editingEvent), () => setEditingEvent(null));
  const { view, setView, currentDate, holidays, navigate } = useCalendarView();
  const { notifiedEvents } = useNotifications(events);
  const { filteredEvents } = useSearch(events, currentDate, view);

  return (
    <VStack flex={1} spacing={5} align="stretch">
      <Heading>일정 보기</Heading>

      <HStack mx="auto" justifyContent="space-between">
        <IconButton
          aria-label="Previous"
          icon={<ChevronLeftIcon />}
          onClick={() => navigate('prev')}
        />
        <Select
          aria-label="view"
          value={view}
          onChange={(e) => setView(e.target.value as 'week' | 'month')}
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
        </Select>
        <IconButton
          aria-label="Next"
          icon={<ChevronRightIcon />}
          onClick={() => navigate('next')}
        />
      </HStack>

      {view === 'week' && (
        <WeekView
          currentDate={currentDate}
          notifiedEvents={notifiedEvents}
          filteredEvents={filteredEvents}
        />
      )}
      {view === 'month' && (
        <MonthView
          currentDate={currentDate}
          holidays={holidays}
          notifiedEvents={notifiedEvents}
          filteredEvents={filteredEvents}
        />
      )}
    </VStack>
  );
};

export default Calender;
