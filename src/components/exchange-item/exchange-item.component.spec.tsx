import React from 'react';
import { render } from '@testing-library/react';
import { ExchangeItem } from './exchange-item.component';
import Currency from 'models/currency.model';

describe('ExchangeItem component', () => {
  const currencies: Currency[] = [
    {
      code: 'PLN',
      symbol: 'zł',
      fullName: 'Polish Zloty',
    },
    {
      code: 'USD',
      symbol: '$',
      fullName: 'US Dollar',
    },
  ];

  test('should render currency dropdown with selected value', () => {
    const selectedCurrency = currencies[0];

    const { getByText } = render(
      <ExchangeItem
        isSource={true}
        amount="0"
        balance={0}
        isBalanceNegative={false}
        selectedCurrency={selectedCurrency}
        onAmountChange={jest.fn()}
        onCurrencySelect={jest.fn()}
      />
    );

    expect(getByText(selectedCurrency.code)).not.toBeNull();
  });

  describe('should render balance label properly', () => {
    test('should render text', () => {
      const labelText = 'Balance:&nbsp;0&nbsp;zł';

      const { getByText } = render(
        <ExchangeItem
          isSource={true}
          amount="0"
          balance={0}
          isBalanceNegative={false}
          selectedCurrency={currencies[0]}
          onAmountChange={jest.fn()}
          onCurrencySelect={jest.fn()}
        />
      );
      const label = getByText(/^Balance:/i);

      expect(label.innerHTML).toBeDefined();
      expect(label.innerHTML).toEqual(labelText);
    });

    test('should render with red color when balance is not enough (negativeBalance = TRUE)', () => {
      const { getByText } = render(
        <ExchangeItem
          isSource={true}
          amount="10"
          balance={0}
          isBalanceNegative={true}
          selectedCurrency={currencies[0]}
          onAmountChange={jest.fn()}
          onCurrencySelect={jest.fn()}
        />
      );
      const label = getByText(/^Balance:/i);

      expect(label.classList.contains('Mui-error')).toBe(true);
    });
  });

  test('should render amount input', () => {
    const amount = '10';

    const { getByDisplayValue } = render(
      <ExchangeItem
        isSource={true}
        amount={amount}
        balance={0}
        isBalanceNegative={false}
        selectedCurrency={currencies[0]}
        onAmountChange={jest.fn()}
        onCurrencySelect={jest.fn()}
      />
    );

    expect(getByDisplayValue(amount)).not.toBeNull();
  });
});
