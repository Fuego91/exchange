import React from 'react';
import { render, RenderResult, fireEvent, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Exchange } from './exchange.container';
import { createStore } from 'redux';
import rootReducer from '../reducers';
import { ExchangeState } from 'reducers/exchange.reducer';
import '@testing-library/jest-dom/extend-expect';
import fetchMock from 'fetch-mock';

const renderExchangeWithReducer = (stateMock: ExchangeState): RenderResult => {
  const storeMock = createStore(rootReducer, { exchange: stateMock });
  return render(
    <Provider store={storeMock}>
      <Exchange />
    </Provider>
  );
};

beforeAll(() => {
  fetchMock.mock('*', { status: 200, body: { rates: {} } });
});

describe('Exchange container', () => {
  test('should render rate label accordingly to state', () => {
    const expectedBaseRateLabel = '1 zł = 2 $';
    const stateMock = {
      source: { currencyCode: 'PLN', amount: '0' },
      target: { currencyCode: 'USD', amount: '0' },
      rates: { USD: 2, PLN: 1 },
      balances: {},
    };
    const { getByText } = renderExchangeWithReducer(stateMock);
    const label = getByText(expectedBaseRateLabel);

    expect(label).not.toBeNull();
  });

  describe('should render source input accordingly to state', () => {
    let component: RenderResult;

    const stateMock = {
      source: { currencyCode: 'PLN', amount: '1' },
      target: { currencyCode: 'USD', amount: '0' },
      rates: { USD: 0, PLN: 1 },
      balances: { USD: 0, PLN: 10 },
    };

    beforeEach(() => {
      component = renderExchangeWithReducer(stateMock);
    });

    test('currency code', () => {
      const sourceInput = component.getByTestId('source-input');
      const currencyCode = within(sourceInput).getByDisplayValue(stateMock.source.currencyCode);

      expect(currencyCode).not.toBeNull();
    });
    test('currency symbol', () => {
      const sourceInput = component.getByTestId('source-input');
      const symbol = within(sourceInput).getByText('zł');

      expect(symbol).not.toBeNull();
    });
    test('amount', () => {
      const sourceInput = component.getByTestId('source-input');
      const amount = within(sourceInput).getByDisplayValue(stateMock.source.amount);

      expect(amount).not.toBeNull();
    });
    test('balance', () => {
      const sourceInput = component.getByTestId('source-input');
      const balance = within(sourceInput).getByText(/^Balance:.*10.*zł/i);

      expect(balance).not.toBeNull();
    });
  });

  describe('should render target input accordingly to state', () => {
    let component: RenderResult;
    const stateMock = {
      source: { currencyCode: 'PLN', amount: '0' },
      target: { currencyCode: 'USD', amount: '2' },
      rates: { USD: 2, PLN: 0 },
      balances: { USD: 20, PLN: 0 },
    };

    beforeEach(() => {
      component = renderExchangeWithReducer(stateMock);
    });

    test('currency code', () => {
      const targetInput = component.getByTestId('target-input');
      const currencyCode = within(targetInput).getByText(stateMock.target.currencyCode);

      expect(currencyCode).not.toBeNull();
    });
    test('currency symbol', () => {
      const targetInput = component.getByTestId('target-input');
      const symbol = within(targetInput).getByText('$');

      expect(symbol).not.toBeNull();
    });
    test('amount', () => {
      const targetInput = component.getByTestId('target-input');
      const amount = within(targetInput).getByDisplayValue(stateMock.target.amount);

      expect(amount).not.toBeNull();
    });
    test('balance', () => {
      const targetInput = component.getByTestId('target-input');
      const balance = within(targetInput).getByText(/^Balance:.*20.*$/i);

      expect(balance).not.toBeNull();
    });
  });

  test('should render flip button', () => {
    const stateMock = {
      source: { currencyCode: 'PLN', amount: '0' },
      target: { currencyCode: 'USD', amount: '2' },
      rates: { USD: 2, PLN: 0 },
      balances: { USD: 20, PLN: 0 },
    };
    const { getByTestId } = renderExchangeWithReducer(stateMock);

    expect(getByTestId('flip-btn')).not.toBeNull();
  });

  test('should render exchange button', () => {
    const stateMock = {
      source: { currencyCode: 'PLN', amount: '0' },
      target: { currencyCode: 'USD', amount: '2' },
      rates: { USD: 2, PLN: 0 },
      balances: { USD: 20, PLN: 0 },
    };
    const { getByText } = renderExchangeWithReducer(stateMock);

    expect(getByText('Exchange')).not.toBeNull();
  });

  describe('flip button', () => {
    let component: RenderResult;
    const stateMock = {
      source: { currencyCode: 'PLN', amount: '0' },
      target: { currencyCode: 'USD', amount: '2' },
      rates: { USD: 2, PLN: 0 },
      balances: { USD: 20, PLN: 0 },
    };

    beforeEach(() => {
      component = renderExchangeWithReducer(stateMock);
      fireEvent.click(component.getByTestId('flip-btn'));
    });

    test('should set source amount to target', () => {
      const sourceInput = component.getByTestId('source-input');
      const newAmount = within(sourceInput).getByDisplayValue(stateMock.target.amount);

      expect(newAmount).not.toBeNull();
    });
    test('should set source currency to target', () => {
      const sourceInput = component.getByTestId('source-input');
      const newCurrencyCode = within(sourceInput).getByDisplayValue(stateMock.target.currencyCode);

      expect(newCurrencyCode).not.toBeNull();
    });
    test('should set source balance to target', () => {
      const sourceInput = component.getByTestId('source-input');
      const balance = within(sourceInput).getByText(/^Balance:.*20.*$/i);

      expect(balance).not.toBeNull();
    });
    test('should set target amount to source', () => {
      const targetInput = component.getByTestId('target-input');
      const newAmount = within(targetInput).getByDisplayValue(stateMock.source.amount);

      expect(newAmount).not.toBeNull();
    });
    test('should set target currency to source', () => {
      const targetInput = component.getByTestId('target-input');
      const newCurrencyCode = within(targetInput).getByDisplayValue(stateMock.source.currencyCode);

      expect(newCurrencyCode).not.toBeNull();
    });
    test('should set target balance to source', () => {
      const targetInput = component.getByTestId('target-input');
      const balance = within(targetInput).getByText(/^Balance:.*0.*zł/i);

      expect(balance).not.toBeNull();
    });
  });

  describe('exchange button', () => {
    test('should disable button accordingly to state', () => {
      const stateMock = {
        source: { currencyCode: 'PLN', amount: '100' },
        target: { currencyCode: 'USD', amount: '2' },
        rates: { USD: 1, PLN: 2 },
        balances: { USD: 0, PLN: 0 },
      };

      const { getByText } = renderExchangeWithReducer(stateMock);
      const btn = getByText('Exchange').closest('button');

      expect(btn).toHaveAttribute('disabled');
    });
    test('should enable button accordingly to state', () => {
      const stateMock = {
        source: { currencyCode: 'PLN', amount: '1' },
        target: { currencyCode: 'USD', amount: '2' },
        rates: { USD: 1, PLN: 2 },
        balances: { USD: 0, PLN: 100 },
      };

      const { getByText } = renderExchangeWithReducer(stateMock);
      const btn = getByText('Exchange').closest('button');

      expect(btn).not.toHaveAttribute('disabled');
    });
    describe('on the button click', () => {
      let component: RenderResult;
      const stateMock = {
        source: { currencyCode: 'PLN', amount: '20' },
        target: { currencyCode: 'USD', amount: '20' },
        rates: { USD: 1, PLN: 1 },
        balances: { USD: 0, PLN: 20 },
      };

      beforeEach(() => {
        component = renderExchangeWithReducer(stateMock);
        fireEvent.click(component.getByText('Exchange'));
      });

      test('should clear source amount', () => {
        const sourceInput = component.getByTestId('source-input');
        const amount = within(sourceInput).getByDisplayValue('0');

        expect(amount).not.toBeNull();
      });
      test('should clear target amount', () => {
        const targetInput = component.getByTestId('target-input');
        const amount = within(targetInput).getByDisplayValue('0');

        expect(amount).not.toBeNull();
      });
      test('should update source balance', () => {
        const sourceInput = component.getByTestId('source-input');
        const balance = within(sourceInput).getByText(/^Balance:.*0.*zł/i);

        expect(balance).not.toBeNull();
      });
      test('should update target balance', () => {
        const targetInput = component.getByTestId('target-input');
        const balance = within(targetInput).getByText(/^Balance:.*20.*$/i);

        expect(balance).not.toBeNull();
      });
    });
  });
});
