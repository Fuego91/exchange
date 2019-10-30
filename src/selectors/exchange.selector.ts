import { RatesMap } from 'reducers/exchange.reducer';
import Currency from 'models/currency.model';
import { RootState } from 'reducers';
import { CURRENCIES_MAP } from 'containers/exchange.constants';

export interface ExchangeSelectorResultItem {
  currency: Currency;
  currencyCode: string;
  amount: string;
  balance: number;
}

export interface ExchangeSelectorResult {
  source: ExchangeSelectorResultItem;
  target: ExchangeSelectorResultItem;
  baseRateLabel: string;
  isSubmitDisabled: boolean;
  isNegativeSourceBalance: boolean;
}

const getRateLabel = (
  sourceItem: ExchangeSelectorResultItem,
  targetItem: ExchangeSelectorResultItem,
  rates: RatesMap
): string =>
  `1 ${sourceItem.currency.symbol} = ${rates[targetItem.currencyCode]} ${
    targetItem.currency.symbol
  }`;

export const selectExchangeState = ({ exchange }: RootState): ExchangeSelectorResult => {
  const { source, target, balances } = exchange;
  const negativeSourceBalance =
    !balances[source.currencyCode] || +source.amount > balances[source.currencyCode];
  const sourceItem = {
    ...source,
    currency: CURRENCIES_MAP[source.currencyCode],
    balance: exchange.balances[source.currencyCode] || 0,
  };
  const targetItem = {
    ...target,
    currency: CURRENCIES_MAP[target.currencyCode],
    balance: exchange.balances[target.currencyCode] || 0,
  };

  return {
    ...exchange,
    source: sourceItem,
    target: targetItem,
    isNegativeSourceBalance: negativeSourceBalance,
    isSubmitDisabled: !+source.amount || !+target.amount || !!negativeSourceBalance,
    baseRateLabel: getRateLabel(sourceItem, targetItem, exchange.rates),
  };
};
