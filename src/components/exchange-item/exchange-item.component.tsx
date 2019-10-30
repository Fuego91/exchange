import React, { FC } from 'react';
import { FormHelperText, Grid } from '@material-ui/core';
import Currency from 'models/currency.model';
import { CurrencySelector } from '../currency-selector/currency-selector.component';
import { ExchangeAmountInput } from 'components/exchange-amount-input/exchange-amount-input.component';

interface ExchangeItemProps {
  amount: string;
  balance: number;
  selectedCurrency: Currency;
  isSource: boolean;
  isBalanceNegative?: boolean;
  onAmountChange: (amount: string) => void;
  onCurrencySelect: (currency: Currency) => void;
}

export const ExchangeItem: FC<ExchangeItemProps> = ({
  selectedCurrency,
  amount,
  balance,
  onAmountChange,
  onCurrencySelect,
  isSource,
  isBalanceNegative,
}) => {
  return (
    <Grid container spacing={0} justify="space-between">
      <Grid item xs={2}>
        <CurrencySelector selectedCurrency={selectedCurrency} onCurrencySelect={onCurrencySelect} />
      </Grid>
      <Grid item xs="auto">
        <ExchangeAmountInput
          amount={amount}
          currencySymbol={selectedCurrency.symbol}
          isSource={isSource}
          onAmountChange={onAmountChange}
        />
      </Grid>
      <Grid item xs={12}>
        <FormHelperText error={isBalanceNegative}>
          Balance:&nbsp;{balance || 0}&nbsp;{selectedCurrency ? selectedCurrency.symbol : ''}
        </FormHelperText>
      </Grid>
    </Grid>
  );
};
