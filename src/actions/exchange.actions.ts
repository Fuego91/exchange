import Currency from 'models/currency.model';
import { RatesMap } from 'reducers/exchange.reducer';

export enum ExchangeActionType {
  FlipInputsClicked = '[Exchange] Flip Inputs Clicked',
  SourceAmountChanged = '[Exchange] Source Amount Changed',
  SourceCurrencyChanged = '[Exchange] Source Currency Changed',
  TargetAmountChanged = '[Exchange] Target Amount Changed',
  TargetCurrencyChanged = '[Exchange] Target Currency Changed',
  ExchangeClicked = '[Exchange] Exchange Clicked',
  RatesUpdated = '[Exchange] Rates updated',
  ClearAmounts = '[Exchange] Clear Amounts',
  ExecuteExchange = '[Balances] Execute Exchange',
}

interface FlipInputsClickedAction {
  type: ExchangeActionType;
}

export const FlipInputsClicked = (): FlipInputsClickedAction => ({
  type: ExchangeActionType.FlipInputsClicked,
});

export interface AmountChangedAction {
  type: ExchangeActionType;
  payload: string;
}

export const SourceAmountChanged = (newAmount: string): AmountChangedAction => ({
  type: ExchangeActionType.SourceAmountChanged,
  payload: newAmount,
});

export const TargetAmountChanged = (newAmount: string): AmountChangedAction => ({
  type: ExchangeActionType.TargetAmountChanged,
  payload: newAmount,
});

export interface CurrencyChangedAction {
  type: ExchangeActionType;
  payload: Currency;
}

export const SourceCurrencyChanged = (newCurrency: Currency): CurrencyChangedAction => ({
  type: ExchangeActionType.SourceCurrencyChanged,
  payload: newCurrency,
});

export const TargetCurrencyChanged = (newCurrency: Currency): CurrencyChangedAction => ({
  type: ExchangeActionType.TargetCurrencyChanged,
  payload: newCurrency,
});

interface ExchangeClickedAction {
  type: ExchangeActionType;
}

export const ExchangeClicked = (): ExchangeClickedAction => ({
  type: ExchangeActionType.ExchangeClicked,
});

export interface RatesUpdatedAction {
  type: ExchangeActionType;
  payload: RatesMap;
}

export const RatesUpdated = (rates: RatesMap): RatesUpdatedAction => ({
  type: ExchangeActionType.RatesUpdated,
  payload: rates,
});

interface ClearAmountsAction {
  type: ExchangeActionType;
}

export const ClearAmounts = (): ClearAmountsAction => ({
  type: ExchangeActionType.ClearAmounts,
});

interface ExecuteExchangeAction {
  type: ExchangeActionType;
}

export const ExecuteExchange = (): ExecuteExchangeAction => ({
  type: ExchangeActionType.ExecuteExchange,
});

export type ExchangeActionTypes =
  | FlipInputsClickedAction
  | CurrencyChangedAction
  | AmountChangedAction
  | ExchangeClickedAction
  | RatesUpdatedAction
  | ClearAmountsAction
  | ExecuteExchangeAction;
