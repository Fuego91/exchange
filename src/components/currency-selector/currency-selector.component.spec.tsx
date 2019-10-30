import React from 'react';
import { render, RenderResult, fireEvent, wait } from '@testing-library/react';
import { CurrencySelector } from './currency-selector.component';
import { act } from 'react-dom/test-utils';
import { CURRENCIES_MAP } from 'containers/exchange.constants';

describe('CurrencySelector component', () => {
  test('should render selected currency code', () => {
    const selectedCurrency = CURRENCIES_MAP.PLN;

    const { getByText } = render(
      <CurrencySelector selectedCurrency={selectedCurrency} onCurrencySelect={() => {}} />
    );

    expect(getByText(selectedCurrency.code)).not.toBeNull();
  });

  test('should render currencies codes in options', async () => {
    let selector: RenderResult;

    act(() => {
      selector = render(
        <CurrencySelector selectedCurrency={CURRENCIES_MAP.PLN} onCurrencySelect={() => {}} />
      );
      fireEvent.click(selector.getByText('PLN'));
    });

    await wait(() => {
      const currencyCode = selector.getByText(CURRENCIES_MAP.USD.code);
      expect(currencyCode).not.toBeNull();
    });
  });

  test('should render currencies full names in options', async () => {
    let selector: RenderResult;

    act(() => {
      selector = render(
        <CurrencySelector selectedCurrency={CURRENCIES_MAP.PLN} onCurrencySelect={() => {}} />
      );
      fireEvent.click(selector.getByText('PLN'));
    });

    await wait(() => {
      const currencyName = selector.getByText(CURRENCIES_MAP.USD.fullName);
      expect(currencyName).not.toBeNull();
    });
  });

  test('should call onCurrencySelect callback with proper currency object', async () => {
    let selector: RenderResult;
    const onCurrencySelect = jest.fn();

    act(() => {
      selector = render(
        <CurrencySelector
          selectedCurrency={CURRENCIES_MAP.PLN}
          onCurrencySelect={onCurrencySelect}
        />
      );
      fireEvent.click(selector.getByText('PLN'));
    });
    act(() => {
      fireEvent.click(selector.getByText('USD'));
    });

    await wait(() => {
      expect(onCurrencySelect).toHaveBeenCalledTimes(1);
    });
  });
});
