import exchangeReducer, { RatesMap, BalancesMap, ExchangeState } from './exchange.reducer';
import {
  FlipInputsClicked,
  SourceAmountChanged,
  TargetAmountChanged,
  SourceCurrencyChanged,
  TargetCurrencyChanged,
  RatesUpdated,
  ExecuteExchange,
} from 'actions/exchange.actions';
import { CURRENCIES_MAP } from 'containers/exchange.constants';

describe('exchange reducer', () => {
  const RATES_MOCK: RatesMap = {
    USD: 1,
    PLN: 2.22222,
    EUR: 3.4,
    BYN: 4.2,
    SEK: 3.3331,
  };

  const BALANCES_MOCK: BalancesMap = {
    USD: 100,
    PLN: 200,
    EUR: 50,
  };

  const INITIAL_STATE: ExchangeState = {
    rates: RATES_MOCK,
    balances: BALANCES_MOCK,
    source: {
      currencyCode: 'USD',
      amount: '5',
    },
    target: {
      currencyCode: 'PLN',
      amount: '11.11',
    },
  };

  it('on FlipInputsClickedAction should populate source with target and vice versa', () => {
    const reducerResult = exchangeReducer(INITIAL_STATE, FlipInputsClicked());

    expect(reducerResult.source).toEqual(INITIAL_STATE.target);
    expect(reducerResult.target).toEqual(INITIAL_STATE.source);
  });

  describe('on SourceAmountChangedAction', () => {
    let reducerResult: ExchangeState;
    const payload = '25';

    beforeAll(() => {
      reducerResult = exchangeReducer(INITIAL_STATE, SourceAmountChanged(payload));
    });

    it('should set payload to source amount', () => {
      expect(reducerResult.source.amount).toEqual(payload);
    });
    it('should recalculate target amount', () => {
      expect(reducerResult.target.amount).toEqual('55.56');
    });
  });

  describe('on TargetAmountChangedAction', () => {
    let reducerResult: ExchangeState;
    const payload = '25';

    beforeAll(() => {
      reducerResult = exchangeReducer(INITIAL_STATE, TargetAmountChanged(payload));
    });

    it('should set payload to target amount', () => {
      expect(reducerResult.target.amount).toEqual(payload);
    });
    it('should recalculate source amount', () => {
      expect(reducerResult.source.amount).toEqual('11.25');
    });
  });

  describe('on SourceCurrencyChangedAction', () => {
    it('should flip inputs if code from payload is the same as target currency code', () => {
      const { source, target } = exchangeReducer(
        INITIAL_STATE,
        SourceCurrencyChanged(CURRENCIES_MAP.PLN)
      );

      expect(source).toEqual(INITIAL_STATE.target);
      expect(target).toEqual(INITIAL_STATE.source);
    });
    it('should set code from payload to source currency', () => {
      const { source } = exchangeReducer(INITIAL_STATE, SourceCurrencyChanged(CURRENCIES_MAP.SEK));

      expect(source.currencyCode).toEqual(CURRENCIES_MAP.SEK.code);
    });
  });

  describe('on TargetCurrencyChangedAction', () => {
    it('should flip inputs if code from payload is the same as source currency code', () => {
      const { source, target } = exchangeReducer(
        INITIAL_STATE,
        TargetCurrencyChanged(CURRENCIES_MAP.USD)
      );

      expect(source).toEqual(INITIAL_STATE.target);
      expect(target).toEqual(INITIAL_STATE.source);
    });
    it('should set code from payload to target currency', () => {
      const { target } = exchangeReducer(INITIAL_STATE, TargetCurrencyChanged(CURRENCIES_MAP.SEK));

      expect(target.currencyCode).toEqual(CURRENCIES_MAP.SEK.code);
    });
    it('should recalculate source amount', () => {
      const { source } = exchangeReducer(INITIAL_STATE, TargetCurrencyChanged(CURRENCIES_MAP.SEK));

      expect(source.amount).toEqual('3.33');
    });
  });

  describe('on RatesUpdatedAction', () => {
    let reducerResult: ExchangeState;
    const payload = { ...RATES_MOCK, PLN: 5.23456 };

    beforeAll(() => {
      reducerResult = exchangeReducer(INITIAL_STATE, RatesUpdated(payload));
    });

    it('should set payload to rates', () => {
      expect(reducerResult.rates).toEqual(payload);
    });
    it('should recalculate target amount', () => {
      expect(reducerResult.target.amount).toEqual('26.18');
    });
  });

  describe('on ExecuteExchangeAction', () => {
    let reducerResult: ExchangeState;

    beforeAll(() => {
      reducerResult = exchangeReducer(INITIAL_STATE, ExecuteExchange());
    });

    it('should reset source amount', () => {
      expect(reducerResult.source.amount).toEqual('0');
    });
    it('should reset target amount', () => {
      expect(reducerResult.target.amount).toEqual('0');
    });
    it('should recalculate source currency balance', () => {
      expect(reducerResult.balances.USD).toEqual(95);
    });
    it('should recalculate target currency balance', () => {
      expect(reducerResult.balances.PLN).toEqual(211.11);
    });
  });
});
