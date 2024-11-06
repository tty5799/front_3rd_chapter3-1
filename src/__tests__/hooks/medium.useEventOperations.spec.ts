import { act, renderHook } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { expect } from 'vitest';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../../__mocks__/handlersUtils.ts';
import { useEventOperations } from '../../hooks/useEventOperations.ts';
import { server } from '../../setupTests.ts';
import { Event } from '../../types.ts';

// ? Medium: 아래 toastFn과 mock과 이 fn은 무엇을 해줄까요?
const toastFn = vi.fn();

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => toastFn,
  };
});

it('저장되어있는 초기 이벤트 데이터를 적절하게 불러온다', async () => {
  const { result } = renderHook(() => useEventOperations(false));

  await act(async () => {
    await result.current.fetchEvents();
  });

  expect(result.current.events).toBeDefined();
});

it('정의된 이벤트 정보를 기준으로 적절하게 저장이 된다', async () => {
  const { result } = renderHook(() => useEventOperations(false));
  const initEvents: Event[] = [
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
  ];

  act(() => {
    setupMockHandlerCreation(initEvents);
  });

  await act(async () => {
    await result.current.saveEvent({
      id: '2',
      title: '점심 먹기',
      date: '2024-10-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '점심 시간',
      location: '식당',
      category: '식사',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    });
  });

  expect(result.current.events[1]).toMatchObject({ id: '2', title: '점심 먹기' });

  expect(toastFn).toHaveBeenCalled();
  expect(toastFn).toHaveBeenCalledWith({
    title: '일정이 추가되었습니다.',
    status: 'success',
    duration: 3000,
    isClosable: true,
  });
});

it("새로 정의된 'title', 'endTime' 기준으로 적절하게 일정이 업데이트 된다", async () => {
  const { result } = renderHook(() => useEventOperations(true));

  act(() => {
    setupMockHandlerUpdating();
  });

  await act(async () => {
    await result.current.saveEvent({
      id: '2',
      title: '점심 먹기',
      date: '2024-10-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '점심 시간',
      location: '식당',
      category: '식사',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    });
  });

  expect(result.current.events[1]).toMatchObject({ id: '2', title: '점심 먹기' });

  expect(toastFn).toHaveBeenCalled();
  expect(toastFn).toHaveBeenCalledWith({
    title: '일정이 수정되었습니다.',
    status: 'success',
    duration: 3000,
    isClosable: true,
  });
});

it('존재하는 이벤트 삭제 시 에러없이 아이템이 삭제된다.', async () => {
  const { result } = renderHook(() => useEventOperations(true));

  act(() => {
    setupMockHandlerDeletion();
  });

  await act(async () => {
    await result.current.deleteEvent('1');
  });

  expect(result.current.events).toEqual([]);

  expect(toastFn).toHaveBeenCalled();
  expect(toastFn).toHaveBeenCalledWith({
    title: '일정이 삭제되었습니다.',
    status: 'info',
    duration: 3000,
    isClosable: true,
  });
});

it("이벤트 로딩 실패 시 '이벤트 로딩 실패'라는 텍스트와 함께 에러 토스트가 표시되어야 한다", async () => {
  const { result } = renderHook(() => useEventOperations(false));

  act(() => {
    server.use(
      http.get('/api/events', () => {
        return new HttpResponse('Internal Server Error', { status: 500 });
      })
    );
  });

  await act(async () => {
    await result.current.fetchEvents();
  });

  expect(toastFn).toHaveBeenCalled();
  expect(toastFn).toHaveBeenCalledWith({
    title: '이벤트 로딩 실패',
    status: 'error',
    duration: 3000,
    isClosable: true,
  });
});

it("존재하지 않는 이벤트 수정 시 '일정 저장 실패'라는 토스트가 노출되며 에러 처리가 되어야 한다", async () => {
  const { result } = renderHook(() => useEventOperations(true));

  act(() => {
    server.use(
      http.put('/api/events/:id', () => {
        return new HttpResponse('Internal Server Error', { status: 500 });
      })
    );
  });

  await act(async () => {
    await result.current.saveEvent({
      id: '2',
      title: '점심 먹기',
      date: '2024-10-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '점심 시간',
      location: '식당',
      category: '식사',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    });
  });

  expect(toastFn).toHaveBeenCalled();
  expect(toastFn).toHaveBeenCalledWith({
    title: '일정 저장 실패',
    status: 'error',
    duration: 3000,
    isClosable: true,
  });
});

it("네트워크 오류 시 '일정 삭제 실패'라는 텍스트가 노출되며 이벤트 삭제가 실패해야 한다", async () => {
  const { result } = renderHook(() => useEventOperations(false));

  act(() => {
    server.use(
      http.delete('/api/events/:id', () => {
        return new HttpResponse('Internal Server Error', { status: 500 });
      })
    );
  });

  await act(async () => {
    await result.current.deleteEvent('1');
  });

  expect(toastFn).toHaveBeenCalled();
  expect(toastFn).toHaveBeenCalledWith({
    title: '일정 삭제 실패',
    status: 'error',
    duration: 3000,
    isClosable: true,
  });
});
