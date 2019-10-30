import React from 'react';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import { ExchangeAmountInput } from './exchange-amount-input.component';

describe('ExchangeAmountInput component', () => {
  const selectedCurrency = {
    code: 'USD',
    symbol: '$',
    fullName: 'Dollar',
  };

  test('should render amount input', () => {
    const amount = '10';

    const { getByDisplayValue } = render(
      <ExchangeAmountInput
        amount={amount}
        currencySymbol={selectedCurrency.symbol}
        isSource={true}
        onAmountChange={jest.fn()}
      />
    );

    expect(getByDisplayValue(amount)).not.toBeNull();
  });

  describe('should render amount input properly', () => {
    test('should render currency sign', () => {
      const { getByText } = render(
        <ExchangeAmountInput
          amount="10"
          currencySymbol={selectedCurrency.symbol}
          isSource={true}
          onAmountChange={jest.fn()}
        />
      );

      expect(getByText('$')).not.toBeNull();
    });

    test('should render - before amount if isSource = TRUE', () => {
      const { getByText } = render(
        <ExchangeAmountInput
          amount="10"
          currencySymbol={selectedCurrency.symbol}
          isSource={true}
          onAmountChange={jest.fn()}
        />
      );

      expect(getByText('-')).not.toBeNull();
    });

    test('should render + before amount if isSource = FALSE', () => {
      const { getByText } = render(
        <ExchangeAmountInput
          amount="10"
          currencySymbol={selectedCurrency.symbol}
          isSource={false}
          onAmountChange={jest.fn()}
        />
      );

      expect(getByText('+')).not.toBeNull();
    });
  });

  describe('amount input should validate new value and call onAmountChange properly', () => {
    test('should call onAmountChange for valid values', () => {
      const onAmountChange = jest.fn();
      const validValue = '5';

      const { getByDisplayValue } = render(
        <ExchangeAmountInput
          amount="10"
          currencySymbol={selectedCurrency.symbol}
          isSource={false}
          onAmountChange={onAmountChange}
        />
      );
      fireEvent.change(getByDisplayValue('10'), { target: { value: validValue } });

      expect(onAmountChange).toHaveBeenCalledWith(validValue);
    });
    test('should replace "," with "."', () => {
      const onAmountChange = jest.fn();

      const { getByDisplayValue } = render(
        <ExchangeAmountInput
          amount="10"
          currencySymbol={selectedCurrency.symbol}
          isSource={false}
          onAmountChange={onAmountChange}
        />
      );
      fireEvent.change(getByDisplayValue('10'), { target: { value: '10,9' } });

      expect(onAmountChange).toHaveBeenCalledWith('10.9');
    });
    test('should not allow letters', () => {
      const onAmountChange = jest.fn();

      const { getByDisplayValue } = render(
        <ExchangeAmountInput
          amount="10"
          currencySymbol={selectedCurrency.symbol}
          isSource={false}
          onAmountChange={onAmountChange}
        />
      );
      fireEvent.change(getByDisplayValue('10'), { target: { value: 'e' } });

      expect(onAmountChange).not.toHaveBeenCalled();
    });
    describe('should not allow special symbols', () => {
      const onAmountChange = jest.fn();
      const initialAmount = '10';
      let component: RenderResult;

      beforeEach(() => {
        component = render(
          <ExchangeAmountInput
            amount="10"
            currencySymbol={selectedCurrency.symbol}
            isSource={false}
            onAmountChange={onAmountChange}
          />
        );
      });
      test('sign +', () => {
        const input = component.getByDisplayValue(initialAmount);
        fireEvent.change(input, { target: { value: '1+' } });

        expect(onAmountChange).not.toHaveBeenCalled();
      });
      test('sign -', () => {
        const input = component.getByDisplayValue(initialAmount);
        fireEvent.change(input, { target: { value: '1-' } });

        expect(onAmountChange).not.toHaveBeenCalled();
      });
      test('sign /', () => {
        const input = component.getByDisplayValue(initialAmount);
        fireEvent.change(input, { target: { value: '1/' } });

        expect(onAmountChange).not.toHaveBeenCalled();
      });
      test('sign :', () => {
        const input = component.getByDisplayValue(initialAmount);
        fireEvent.change(input, { target: { value: '1:' } });

        expect(onAmountChange).not.toHaveBeenCalled();
      });
      test('sign *', () => {
        const input = component.getByDisplayValue(initialAmount);
        fireEvent.change(input, { target: { value: '1*' } });

        expect(onAmountChange).not.toHaveBeenCalled();
      });
    });
  });
});
