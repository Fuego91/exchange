import {
  ExchangeActionType,
  ExchangeActionTypes,
  AmountChangedAction,
  CurrencyChangedAction,
  RatesUpdatedAction,
} from 'actions/exchange.actions';

export interface RatesMap {
  [currencyCode: string]: number;
}

export interface BalancesMap {
  [currencyCode: string]: number;
}

export interface ExchangeItem {
  currencyCode: string;
  amount: string;
}

export interface ExchangeState {
  source: ExchangeItem;
  target: ExchangeItem;
  rates: RatesMap;
  balances: BalancesMap;
}

const INITIAL_FROM: ExchangeItem = {
  currencyCode: 'PLN',
  amount: '0',
};

const INITIAL_TO: ExchangeItem = {
  currencyCode: 'USD',
  amount: '0',
};

const INITIAL_BALANCES: BalancesMap = {
  PLN: 1500,
  USD: 1000,
  SEK: 500,
};

const INITIAL_EXCHANGE_STATE: ExchangeState = {
  source: INITIAL_FROM,
  target: INITIAL_TO,
  rates: {},
  balances: INITIAL_BALANCES,
};

const getNewSourceAmount = (
  targetAmount: string,
  targetCurrencyCode: string,
  rates: RatesMap
): string => {
  const rate = rates[targetCurrencyCode];
  const fullAmount = +targetAmount / rates[targetCurrencyCode] || 0;
  const sourceAmount =
    rate < 1 ? Math.ceil(fullAmount * 100) / 100 : Math.floor(fullAmount * 100) / 100;
  return sourceAmount.toFixed(2).toString();
};

const getNewTargetAmount = (
  sourceAmount: string,
  targetCurrencyCode: string,
  rates: RatesMap
): string => {
  const rate = rates[targetCurrencyCode];
  const fullAmount = +sourceAmount * rate || 0;
  const targetAmount =
    rate < 1 ? Math.floor(fullAmount * 100) / 100 : Math.ceil(fullAmount * 100) / 100;
  return targetAmount.toFixed(2).toString();
};

const flipCurrencies = (state: ExchangeState): ExchangeState => ({
  ...state,
  source: { ...state.target },
  target: { ...state.source },
});

const handleSourceAmountChangedAction = (
  state: ExchangeState,
  { payload: amount }: AmountChangedAction
): ExchangeState => ({
  ...state,
  source: {
    ...state.source,
    amount,
  },
  target: {
    ...state.target,
    amount: getNewTargetAmount(amount, state.target.currencyCode, state.rates),
  },
});

const handleTargetAmountChangedAction = (
  state: ExchangeState,
  { payload: amount }: AmountChangedAction
): ExchangeState => ({
  ...state,
  target: {
    ...state.target,
    amount,
  },
  source: {
    ...state.source,
    amount: getNewSourceAmount(amount, state.target.currencyCode, state.rates),
  },
});

const handleSourceCurrencyChanged = (
  state: ExchangeState,
  { payload: currency }: CurrencyChangedAction
): ExchangeState => {
  if (currency.code === state.target.currencyCode) {
    return flipCurrencies(state);
  }
  return {
    ...state,
    source: {
      ...state.source,
      currencyCode: currency.code,
    },
  };
};

const handleTargetCurrencyChanged = (
  state: ExchangeState,
  { payload: currency }: CurrencyChangedAction
): ExchangeState => {
  const { target, rates } = state;
  if (currency.code === state.source.currencyCode) {
    return flipCurrencies(state);
  }
  return {
    ...state,
    target: {
      ...state.target,
      currencyCode: currency.code,
    },
    source: {
      ...state.source,
      amount: getNewSourceAmount(target.amount, currency.code, rates),
    },
  };
};

const handleRatesUpdated = (
  state: ExchangeState,
  { payload: rates }: RatesUpdatedAction
): ExchangeState => {
  const { target: to, source: from } = state;
  return {
    ...state,
    rates,
    target: {
      ...to,
      amount: getNewTargetAmount(from.amount, to.currencyCode, rates),
    },
  };
};

const handleExecuteExchange = (state: ExchangeState): ExchangeState => {
  const { target, source, balances } = state;
  const sourceBalance = balances[source.currencyCode] || 0;
  const targetBalance = balances[target.currencyCode] || 0;
  return {
    ...state,
    target: {
      ...target,
      amount: '0',
    },
    source: {
      ...source,
      amount: '0',
    },
    balances: {
      ...balances,
      [source.currencyCode]: +(sourceBalance - +source.amount).toFixed(2),
      [target.currencyCode]: +(targetBalance + +target.amount).toFixed(2),
    },
  };
};

const exchangeReducer = (
  state: ExchangeState = INITIAL_EXCHANGE_STATE,
  action: ExchangeActionTypes
): ExchangeState => {
  switch (action.type) {
    case ExchangeActionType.FlipInputsClicked:
      return flipCurrencies(state);

    case ExchangeActionType.SourceAmountChanged:
      return handleSourceAmountChangedAction(state, action as AmountChangedAction);

    case ExchangeActionType.TargetAmountChanged:
      return handleTargetAmountChangedAction(state, action as AmountChangedAction);

    case ExchangeActionType.SourceCurrencyChanged:
      return handleSourceCurrencyChanged(state, action as CurrencyChangedAction);

    case ExchangeActionType.TargetCurrencyChanged:
      return handleTargetCurrencyChanged(state, action as CurrencyChangedAction);

    case ExchangeActionType.RatesUpdated:
      return handleRatesUpdated(state, action as RatesUpdatedAction);

    case ExchangeActionType.ExecuteExchange:
      return handleExecuteExchange(state);

    default:
      return state;
  }
};

export default exchangeReducer;
