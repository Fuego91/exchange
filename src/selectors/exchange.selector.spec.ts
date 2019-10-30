import { selectExchangeState, ExchangeSelectorResultItem } from './exchange.selector';
import { RatesMap, ExchangeState, BalancesMap } from 'reducers/exchange.reducer';
import { CURRENCIES_MAP } from 'containers/exchange.constants';

describe('exchange selector', () => {
  const RATES_MOCK: RatesMap = {
    USD: 1,
    PLN: 1,
    EUR: 1,
    SEK: 1,
  };

  const BALANCES_MOCK: BalancesMap = {
    USD: 100,
    PLN: 200,
    EUR: 50,
  };

  describe('should populate baseRateLabel properly', () => {
    it('when currency objects are defined populate symbols', () => {
      const stateMock: ExchangeState = {
        rates: RATES_MOCK,
        balances: BALANCES_MOCK,
        source: {
          currencyCode: 'PLN',
          amount: '0',
        },
        target: {
          currencyCode: 'USD',
          amount: '0',
        },
      };
      const expectedLabel = '1 zł = 1 $';

      const { baseRateLabel } = selectExchangeState({ exchange: stateMock });

      expect(baseRateLabel).toEqual(expectedLabel);
    });
    it('target rate value by target currency code', () => {
      const stateMock: ExchangeState = {
        rates: { ...RATES_MOCK, USD: 2 },
        balances: BALANCES_MOCK,
        source: {
          currencyCode: 'PLN',
          amount: '0',
        },
        target: {
          currencyCode: 'USD',
          amount: '0',
        },
      };
      const expectedLabel = '1 zł = 2 $';

      const { baseRateLabel } = selectExchangeState({ exchange: stateMock });

      expect(baseRateLabel).toEqual(expectedLabel);
    });
  });

  describe('should calculate negative balance properly', () => {
    it('when source balance is empty - true', () => {
      const stateMock: ExchangeState = {
        rates: RATES_MOCK,
        balances: BALANCES_MOCK,
        source: {
          currencyCode: 'SEK',
          amount: '15',
        },
        target: {
          currencyCode: 'PLN',
          amount: '0',
        },
      };

      const { isNegativeSourceBalance: negativeSourceBalance } = selectExchangeState({
        exchange: stateMock,
      });

      expect(negativeSourceBalance).toBe(true);
    });
    it('when source amount is bigger than source balance - true', () => {
      const stateMock: ExchangeState = {
        rates: RATES_MOCK,
        balances: BALANCES_MOCK,
        source: {
          currencyCode: 'USD',
          amount: '5000',
        },
        target: {
          currencyCode: 'PLN',
          amount: '0',
        },
      };

      const { isNegativeSourceBalance: negativeSourceBalance } = selectExchangeState({
        exchange: stateMock,
      });

      expect(negativeSourceBalance).toBe(true);
    });
    it('when source balance ai defined and is >= then source amount - false', () => {
      const stateMock: ExchangeState = {
        rates: RATES_MOCK,
        balances: BALANCES_MOCK,
        source: {
          currencyCode: 'USD',
          amount: '100',
        },
        target: {
          currencyCode: 'PLN',
          amount: '0',
        },
      };

      const { isNegativeSourceBalance: negativeSourceBalance } = selectExchangeState({
        exchange: stateMock,
      });

      expect(negativeSourceBalance).toBe(false);
    });
  });

  describe('should calculate availability of submit button properly', () => {
    it('when source amount is 0 - disable', () => {
      const stateMock: ExchangeState = {
        rates: RATES_MOCK,
        balances: BALANCES_MOCK,
        source: {
          currencyCode: 'USD',
          amount: '0',
        },
        target: {
          currencyCode: 'PLN',
          amount: '10',
        },
      };

      const { isSubmitDisabled: submitDisabled } = selectExchangeState({ exchange: stateMock });

      expect(submitDisabled).toBe(true);
    });
    it('when target amount is 0 - disable', () => {
      const stateMock: ExchangeState = {
        rates: RATES_MOCK,
        balances: BALANCES_MOCK,
        source: {
          currencyCode: 'USD',
          amount: '10',
        },
        target: {
          currencyCode: 'PLN',
          amount: '0',
        },
      };

      const { isSubmitDisabled: submitDisabled } = selectExchangeState({ exchange: stateMock });

      expect(submitDisabled).toBe(true);
    });
    it('when source balance is not enough - disable', () => {
      const stateMock: ExchangeState = {
        rates: RATES_MOCK,
        balances: BALANCES_MOCK,
        source: {
          currencyCode: 'USD',
          amount: '500000',
        },
        target: {
          currencyCode: 'PLN',
          amount: '0',
        },
      };

      const { isSubmitDisabled: submitDisabled } = selectExchangeState({ exchange: stateMock });

      expect(submitDisabled).toBe(true);
    });
    it('when balance is enough and source and target amount are positive - enable', () => {
      const stateMock: ExchangeState = {
        rates: RATES_MOCK,
        balances: BALANCES_MOCK,
        source: {
          currencyCode: 'USD',
          amount: '1',
        },
        target: {
          currencyCode: 'PLN',
          amount: '1',
        },
      };

      const { isSubmitDisabled: submitDisabled } = selectExchangeState({ exchange: stateMock });

      expect(submitDisabled).toBe(false);
    });
  });

  describe('should populate target and source properly', () => {
    let target: ExchangeSelectorResultItem;
    let source: ExchangeSelectorResultItem;
    const stateMock: ExchangeState = {
      rates: RATES_MOCK,
      balances: BALANCES_MOCK,
      source: {
        currencyCode: 'USD',
        amount: '1',
      },
      target: {
        currencyCode: 'PLN',
        amount: '1',
      },
    };

    beforeAll(() => {
      const result = selectExchangeState({ exchange: stateMock });
      target = result.target;
      source = result.source;
    });

    describe('source', () => {
      it('should set currencyCode', () => {
        expect(source.currencyCode).toBe(stateMock.source.currencyCode);
      });
      it('should set amount', () => {
        expect(source.amount).toBe(stateMock.source.amount);
      });
      it('should populate currency object by currency code', () => {
        expect(source.currency).toEqual(CURRENCIES_MAP.USD);
      });
      it('should populate balance by currency code', () => {
        expect(source.balance).toEqual(BALANCES_MOCK.USD);
      });
    });
    describe('target', () => {
      it('should set currencyCode', () => {
        expect(target.currencyCode).toBe(stateMock.target.currencyCode);
      });
      it('should set amount', () => {
        expect(target.amount).toBe(stateMock.target.amount);
      });
      it('should populate currency object by currency code', () => {
        expect(target.currency).toEqual(CURRENCIES_MAP.PLN);
      });
      it('should populate balance by currency code', () => {
        expect(target.balance).toEqual(BALANCES_MOCK.PLN);
      });
    });
  });
});
