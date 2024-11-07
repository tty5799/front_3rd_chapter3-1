import { act, renderHook } from '@testing-library/react';
import { expect, it } from 'vitest';

import { useAddOrUpdateEvent } from '../../hooks/useAddOrUpdateEvent.ts';
import { Event, EventForm } from '../../types.ts';

const toastFn = vi.fn();
const saveEvent = vi.fn();
const resetForm = vi.fn();

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => toastFn,
  };
});

describe('useAddOrUpdateEvent >', () => {
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

  it('초기 상태에는 일정 경고가 노출 되지 않아야 한다.', () => {
    const { result } = renderHook(() => useAddOrUpdateEvent(saveEvent, resetForm));

    expect(result.current.isOverlapDialogOpen).toBe(false);
  });

  it('필수 정보가 누락되면 유효성 검사에 실패한다.', () => {
    const newEvent: Event | EventForm = {
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      description: '설명',
      location: '위치',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 3000,
      },
      notificationTime: 10,
    };

    const { result } = renderHook(() => useAddOrUpdateEvent(saveEvent, resetForm));

    act(() => {
      result.current.addOrUpdateEvent(newEvent, events, null, null);
    });

    expect(toastFn).toHaveBeenCalled();
    expect(toastFn).toHaveBeenCalledWith({
      title: '필수 정보를 모두 입력해주세요.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  });

  it('시간 오류가 있다면 유효성 검사에 실패한다.', async () => {
    const { result } = renderHook(() => useAddOrUpdateEvent(saveEvent, resetForm));

    const newEvent: Event | EventForm = {
      title: '제목',
      date: '2024-10-15',
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

    await act(async () => {
      await result.current.addOrUpdateEvent(
        newEvent,
        events,
        '시작 시간은 종료 시간보다 빨라야 합니다.',
        '종료 시간은 시작 시간보다 늦어야 합니다.'
      );
    });

    expect(toastFn).toHaveBeenCalled();
    expect(toastFn).toHaveBeenCalledWith({
      title: '시간 설정을 확인해주세요.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  });

  it('중복된 이벤트가 있다면 일정 경고가 노출된다.', () => {
    const { result } = renderHook(() => useAddOrUpdateEvent(saveEvent, resetForm));

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
      result.current.addOrUpdateEvent(newEvent, events, null, null);
    });

    expect(result.current.isOverlapDialogOpen).toBe(true);
  });

  it('중복된 이벤트가 없다면 일정 경고가 노출되지 않는다.', () => {
    const { result } = renderHook(() => useAddOrUpdateEvent(saveEvent, resetForm));

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
      result.current.addOrUpdateEvent(newEvent, events, null, null);
    });

    expect(result.current.isOverlapDialogOpen).toBe(false);
  });
});
