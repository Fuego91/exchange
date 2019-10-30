import { useEffect, useCallback } from 'react';
import { RatesMap } from 'reducers/exchange.reducer';

const API_URL = 'https://api.exchangeratesapi.io';

export interface RatesHookProps {
  baseCurrencyCode: string;
  onRatesUpdated: (rates: RatesMap) => void;
}

export const useRates = (
  baseCurrencyCode: string,
  onRatesUpdated: (rates: RatesMap) => void
): void => {
  const fetchRates = useCallback(() => {
    if (baseCurrencyCode) {
      fetch(`${API_URL}/latest?base=${baseCurrencyCode}`)
        .then(response => response.json())
        .then((response: { rates: RatesMap }) => {
          onRatesUpdated(response.rates);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseCurrencyCode]);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(() => {
      fetchRates();
    }, 10000);
    return () => clearInterval(interval);
  }, [baseCurrencyCode, fetchRates]);
};
