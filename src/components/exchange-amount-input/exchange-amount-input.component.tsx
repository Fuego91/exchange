import React, { FC } from 'react';
import { InputAdornment, Input } from '@material-ui/core';

interface ExchangeAmountInputProps {
  amount: string;
  currencySymbol: string;
  isSource: boolean;
  onAmountChange: (amount: string) => void;
}

export const ExchangeAmountInput: FC<ExchangeAmountInputProps> = ({
  currencySymbol,
  amount,
  onAmountChange,
  isSource,
}: ExchangeAmountInputProps) => {
  const CurrencySymbol: FC = () => <InputAdornment position="end">{currencySymbol}</InputAdornment>;

  const WithdrawDirectionSign: FC = () => (
    <InputAdornment position="start">{isSource ? '-' : '+'}</InputAdornment>
  );

  const handleAmountChange = (changeEvent: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = changeEvent.currentTarget;
    const formattedValue = value ? value.replace(',', '.') : value;
    // eslint-disable-next-line
    const regexp = /^\d*([\.]{1}\d{0,2})?$/g;
    if (regexp.test(formattedValue)) {
      onAmountChange(formattedValue);
    }
  };

  return (
    <Input
      disableUnderline={true}
      value={amount}
      onChange={handleAmountChange}
      startAdornment={<WithdrawDirectionSign />}
      endAdornment={<CurrencySymbol />}
      inputProps={{
        style: {
          width: amount.length * 5 + 50 || 50,
        },
      }}
    />
  );
};
