import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import useEventOverlapCheck from '../../hooks/useEventOverlapCheck.ts';
import { Event, EventForm } from '../../types.ts';

describe('useEventOverlapCheck', () => {
  const events: Event[] = [
    {
      id: '1',
      title: '제목',
      date: '2024-10-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '설명',
      location: '위치',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 3000,
      },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '제목 2',
      date: '2024-10-11',
      startTime: '10:00',
      endTime: '11:00',
      description: '설명 2',
      location: '위치 2',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 3000,
      },
      notificationTime: 10,
    },
  ];

  it('중복 이벤트가 있을 경우 true를 반환한다.', () => {
    const { result } = renderHook(() => useEventOverlapCheck());

    const newEvent: Event | EventForm = {
      title: '제목',
      date: '2024-10-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '설명',
      location: '위치',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 3000,
      },
      notificationTime: 10,
    };

    act(() => {
      result.current.checkOverlap(newEvent, events);
    });

    expect(result.current.isOverlapDialogOpen).toBe(true);
  });

  it('중복된 이벤트가 없을 경우 false를 반환한다.', () => {
    const { result } = renderHook(() => useEventOverlapCheck());

    const newEvent: Event | EventForm = {
      title: '제목',
      date: '2024-10-31',
      startTime: '10:00',
      endTime: '11:00',
      description: '설명',
      location: '위치',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 3000,
      },
      notificationTime: 10,
    };

    act(() => {
      result.current.checkOverlap(newEvent, events);
    });

    expect(result.current.isOverlapDialogOpen).toBe(false);
  });
});
