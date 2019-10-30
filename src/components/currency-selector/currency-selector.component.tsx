import React, { FC, ReactNode } from 'react';
import { Select, MenuItem } from '@material-ui/core';
import Currency from 'models/currency.model';
import styled from 'styled-components';
import { CURRENCIES_MAP } from 'containers/exchange.constants';

interface CurrencySelectorProps {
  selectedCurrency: Currency;
  onCurrencySelect: (currency: Currency) => void;
}

const FulNameSpan = styled.span`
  color: #0000008a;
  padding-left: 5px;
`;

export const CurrencySelector: FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencySelect,
}: CurrencySelectorProps) => {
  const handleSelect = (changeEvent: React.ChangeEvent<any>): void => {
    if (changeEvent.target) {
      onCurrencySelect(CURRENCIES_MAP[changeEvent.target.value]);
    }
  };

  const getMenuItem = (currency: Currency): ReactNode => (
    <MenuItem key={currency.code} value={currency.code}>
      <span>{currency.code}</span>
      <FulNameSpan>{currency.fullName}</FulNameSpan>
    </MenuItem>
  );

  return (
    <Select
      disableUnderline={true}
      data-testid="currency-selector"
      value={selectedCurrency ? selectedCurrency.code : null}
      displayEmpty={!selectedCurrency}
      onChange={handleSelect}
      renderValue={(value: any) => value}>
      {Object.keys(CURRENCIES_MAP).map((key: string) => getMenuItem(CURRENCIES_MAP[key]))}
    </Select>
  );
};
