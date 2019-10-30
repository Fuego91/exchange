import React, { FC } from 'react';
import Button from '@material-ui/core/Button';
import { IconButton, styled, Chip, Grid } from '@material-ui/core';
import { FlipCameraAndroid } from '@material-ui/icons';
import { ExchangeItem } from '../components/exchange-item/exchange-item.component';
import Currency from 'models/currency.model';
import { useDispatch, useSelector } from 'react-redux';
import {
  FlipInputsClicked,
  SourceAmountChanged,
  TargetAmountChanged,
  SourceCurrencyChanged,
  TargetCurrencyChanged,
  RatesUpdated,
  ExecuteExchange,
} from 'actions/exchange.actions';
import { selectExchangeState, ExchangeSelectorResult } from 'selectors/exchange.selector';
import { RatesMap } from 'reducers/exchange.reducer';
import { useRates } from '../hooks/rates.hook';
import { RootState } from 'reducers';

const EllipseButton = styled(Button)({
  borderRadius: 50,
});

const GridWithTopMargin = styled(Grid)({
  marginTop: 55,
  zIndex: 1,
});

export const Exchange: FC = () => {
  const dispatch = useDispatch();

  const {
    source,
    target,
    baseRateLabel,
    isNegativeSourceBalance: negativeSourceBalance,
    isSubmitDisabled: submitDisabled,
  } = useSelector<RootState, ExchangeSelectorResult>(selectExchangeState);

  const handleRatesUpdate = (rates: RatesMap) => dispatch(RatesUpdated(rates));

  useRates(source.currencyCode, handleRatesUpdate);

  const handleFlipInputs = () => dispatch(FlipInputsClicked());

  const handleSourceAmountChange = (amount: string) => dispatch(SourceAmountChanged(amount));

  const handleTargetAmountChange = (amount: string) => dispatch(TargetAmountChanged(amount));

  const handleSourceCurrencyChange = (currency: Currency) =>
    dispatch(SourceCurrencyChanged(currency));

  const handleTargetCurrencyChange = (currency: Currency) =>
    dispatch(TargetCurrencyChanged(currency));

  const handleExchangeClick = () => dispatch(ExecuteExchange());

  return (
    <GridWithTopMargin container spacing={3} justify="space-between">
      <Grid item xs={12}>
        <div data-testid="source-input">
          {source && (
            <ExchangeItem
              isSource={true}
              amount={source.amount}
              balance={source.balance}
              isBalanceNegative={negativeSourceBalance}
              selectedCurrency={source.currency}
              onAmountChange={handleSourceAmountChange}
              onCurrencySelect={handleSourceCurrencyChange}
            />
          )}
        </div>
      </Grid>
      <Grid item xs={2}>
        <IconButton
          color="primary"
          data-testid="flip-btn"
          aria-label="delete"
          size="small"
          onClick={handleFlipInputs}>
          <FlipCameraAndroid />
        </IconButton>
      </Grid>
      <Grid item xs="auto">
        <Chip label={baseRateLabel} color="primary" variant="outlined" />
      </Grid>
      <Grid item xs={12}>
        <div data-testid="target-input">
          {target && (
            <ExchangeItem
              isSource={false}
              amount={target.amount}
              balance={target.balance}
              selectedCurrency={target.currency}
              onAmountChange={handleTargetAmountChange}
              onCurrencySelect={handleTargetCurrencyChange}
            />
          )}
        </div>
      </Grid>

      <Grid item xs={12}>
        <EllipseButton
          variant="contained"
          color="secondary"
          fullWidth={true}
          className="exchange-btn"
          disabled={submitDisabled}
          onClick={handleExchangeClick}>
          Exchange
        </EllipseButton>
      </Grid>
    </GridWithTopMargin>
  );
};
