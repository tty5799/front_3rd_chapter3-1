import { expect } from 'vitest';

import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

const events: Event[] = [
  {
    id: '1',
    title: '이벤트 2',
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
    title: '이벤트 5',
    date: '2024-07-01',
    startTime: '12:00',
    endTime: '15:00',
    description: '주간 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
  {
    id: '3',
    title: '이벤트 4',
    date: '2024-07-05',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
  {
    id: '4',
    title: 'Event',
    date: '2024-07-31',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
];

describe('getFilteredEvents', () => {
  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    const date = new Date('2024-11-01');

    expect(getFilteredEvents(events, '이벤트 2', date, 'week')).toEqual([
      {
        id: '1',
        title: '이벤트 2',
        date: '2024-11-01',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
    ]);
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    const date = new Date('2024-07-01');

    expect(getFilteredEvents(events, '', date, 'week')).toEqual([
      {
        id: '2',
        title: '이벤트 5',
        date: '2024-07-01',
        startTime: '12:00',
        endTime: '15:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
      {
        id: '3',
        title: '이벤트 4',
        date: '2024-07-05',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
    ]);
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    const date = new Date('2024-07-01');

    expect(getFilteredEvents(events, '', date, 'month')).toEqual([
      {
        id: '2',
        title: '이벤트 5',
        date: '2024-07-01',
        startTime: '12:00',
        endTime: '15:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
      {
        id: '3',
        title: '이벤트 4',
        date: '2024-07-05',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
      {
        id: '4',
        title: 'Event',
        date: '2024-07-31',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
    ]);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const date = new Date('2024-07-01');

    expect(getFilteredEvents(events, '이벤트', date, 'week')).toEqual([
      {
        id: '2',
        title: '이벤트 5',
        date: '2024-07-01',
        startTime: '12:00',
        endTime: '15:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
      {
        id: '3',
        title: '이벤트 4',
        date: '2024-07-05',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
    ]);
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const date = new Date('2024-07-01');

    expect(getFilteredEvents(events, '', date, 'month')).toEqual([
      {
        id: '2',
        title: '이벤트 5',
        date: '2024-07-01',
        startTime: '12:00',
        endTime: '15:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
      {
        id: '3',
        title: '이벤트 4',
        date: '2024-07-05',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
      {
        id: '4',
        title: 'Event',
        date: '2024-07-31',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
    ]);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const date = new Date('2024-07-01');

    expect(getFilteredEvents(events, 'event', date, 'month')).toEqual([
      {
        id: '4',
        title: 'Event',
        date: '2024-07-31',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
    ]);
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const date = new Date('2024-07-31');

    expect(getFilteredEvents(events, '', date, 'month')).toEqual([
      {
        id: '2',
        title: '이벤트 5',
        date: '2024-07-01',
        startTime: '12:00',
        endTime: '15:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
      {
        id: '3',
        title: '이벤트 4',
        date: '2024-07-05',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
      {
        id: '4',
        title: 'Event',
        date: '2024-07-31',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
    ]);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const date = new Date('2024-07-01');

    expect(getFilteredEvents([], '', date, 'week')).toEqual([]);
  });
});
