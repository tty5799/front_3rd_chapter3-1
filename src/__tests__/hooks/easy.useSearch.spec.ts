import { act, renderHook } from '@testing-library/react';
import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';
import { expect } from 'vitest';

const events: Event[] = [
  {
    id: '1',
    title: '팀 회의',
    date: '2024-11-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
  {
    id: '2',
    title: '팀 점심',
    date: '2024-11-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 점심',
    location: '식당',
    category: '식사',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
  {
    id: '2',
    title: '팀 점심',
    date: '2024-12-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 점심',
    location: '식당',
    category: '식사',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
];

const currentDate = new Date('2024-11-01');

it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, currentDate, 'week'));

  expect(result.current.filteredEvents).toEqual(events);
});

it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, currentDate, 'week'));

  act(() => {
    result.current.setSearchTerm('팀 회의');
  });

  expect(result.current.filteredEvents).toEqual([events[0]]);
});

it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, currentDate, 'week'));

  act(() => {
    result.current.setSearchTerm('점심');
  });

  expect(result.current.filteredEvents).toEqual([events[1]]);
});

it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, currentDate, 'month'));

  expect(result.current.filteredEvents).toEqual([events[0], events[1]]);
});

it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
  const { result } = renderHook(() => useSearch(events, currentDate, 'month'));

  act(() => {
    result.current.setSearchTerm('회의');
  });

  expect(result.current.filteredEvents).toEqual([events[0]]);

  act(() => {
    result.current.setSearchTerm('점심');
  });

  expect(result.current.filteredEvents).toEqual([events[1]]);
});
