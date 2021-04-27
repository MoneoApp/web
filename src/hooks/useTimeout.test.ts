import { renderHook } from '@testing-library/react-hooks';

import { useTimeout } from './useTimeout';

beforeEach(() => jest.useFakeTimers());

it('should call the callback after the timeout', () => {
  const fn = jest.fn();

  renderHook(() => useTimeout(0, fn, []));

  expect(setTimeout).toHaveBeenCalledTimes(2);
  expect(setTimeout).toHaveBeenCalledWith(fn, 0);
});

it('should cancel the previous timeout after a change', () => {
  const fn = jest.fn();

  const { rerender } = renderHook((timeout: number = 1000) => useTimeout(timeout, fn, []));

  rerender(2000);

  jest.runAllTimers();

  expect(clearTimeout).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledTimes(1);
});
