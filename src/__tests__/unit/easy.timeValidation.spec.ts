import { expect } from 'vitest';

import { getTimeErrorMessage } from '../../utils/timeValidation';

describe('getTimeErrorMessage >', () => {
  const startTime = '13:00';
  const endTime = '13:10';
  const resultTimeErrorMessages = {
    startTimeError: '시작 시간은 종료 시간보다 빨라야 합니다.',
    endTimeError: '종료 시간은 시작 시간보다 늦어야 합니다.',
  };

  it('시작 시간이 종료 시간보다 늦을 때 에러 메시지를 반환한다', () => {
    expect(getTimeErrorMessage(endTime, startTime)).toEqual(resultTimeErrorMessages);
  });

  it('시작 시간과 종료 시간이 같을 때 에러 메시지를 반환한다', () => {
    expect(getTimeErrorMessage(startTime, startTime)).toEqual(resultTimeErrorMessages);
  });

  it('시작 시간이 종료 시간보다 빠를 때 null을 반환한다', () => {
    const { startTimeError, endTimeError } = getTimeErrorMessage(startTime, endTime);

    expect(startTimeError).toBeNull();
    expect(endTimeError).toBeNull();
  });

  it('시작 시간이 비어있을 때 null을 반환한다', () => {
    const { startTimeError, endTimeError } = getTimeErrorMessage('', endTime);

    expect(startTimeError).toBeNull();
    expect(endTimeError).toBeNull();
  });

  it('종료 시간이 비어있을 때 null을 반환한다', () => {
    const { startTimeError, endTimeError } = getTimeErrorMessage(startTime, '');

    expect(startTimeError).toBeNull();
    expect(endTimeError).toBeNull();
  });

  it('시작 시간과 종료 시간이 모두 비어있을 때 null을 반환한다', () => {
    const { startTimeError, endTimeError } = getTimeErrorMessage('', '');

    expect(startTimeError).toBeNull();
    expect(endTimeError).toBeNull();
  });
});
