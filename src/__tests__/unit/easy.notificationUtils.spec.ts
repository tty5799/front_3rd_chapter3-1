import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';
import { expect } from 'vitest';

const events: Event[] = [
  {
    id: '1',
    title: '이벤트 2',
    date: '2024-07-01',
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
];

describe('getUpcomingEvents', () => {
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const date = new Date('2024-07-01T11:59');

    const resultEvents = [events[1]];

    expect(getUpcomingEvents(events, date, [])).toEqual(resultEvents);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const notifiedEvents = ['2'];
    const date = new Date('2024-07-01T11:59');

    expect(getUpcomingEvents(events, date, notifiedEvents)).toEqual([]);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const date = new Date('2024-07-01T11:50');

    expect(getUpcomingEvents(events, date, [])).toEqual([]);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const date = new Date('2024-07-01T12:50');

    expect(getUpcomingEvents(events, date, [])).toEqual([]);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    expect(createNotificationMessage(events[0])).toBe('1분 후 이벤트 2 일정이 시작됩니다.');
  });
});
