import fetchMock from 'fetch-mock';
import { useRates } from './rates.hook';
import { renderHook } from '@testing-library/react-hooks';
import { wait } from '@testing-library/dom';

import { act } from 'react-test-renderer';
import { cleanup } from '@testing-library/react';

describe('useRates hook', () => {
  const responseMock = { status: 400, body: { rates: { USD: 1, PLN: 2, SEK: 0 } } };

  afterAll(() => {
    fetchMock.restore();
    fetchMock.reset();
    cleanup();
  });

  test('should trigger fetch on render', async () => {
    let result: any;
    fetchMock.getOnce('https://api.exchangeratesapi.io/latest?base=USD', responseMock);

    await act(async () => {
      result = renderHook(() => useRates('USD', jest.fn()));
      await result.waitForNextUpdate();
    });

    await wait(() => {
      expect(fetchMock.done()).toBe(true);
      cleanup();
    });
  });

  test('should call onRatesUpdated callback on promise success', async () => {
    const onUpdateCallback = jest.fn();
    fetchMock.getOnce('https://api.exchangeratesapi.io/latest?base=BYN', responseMock);

    await act(async () => {
      const { waitForNextUpdate } = renderHook(() => useRates('BYN', onUpdateCallback));
      await waitForNextUpdate();
      fetchMock.flush();
    });

    await wait(() => {
      expect(onUpdateCallback).toHaveBeenCalledTimes(1);
    });
  });
});
