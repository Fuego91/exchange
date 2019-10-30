import { combineReducers } from 'redux';
import exchangeReducer, { ExchangeState } from './exchange.reducer';

export interface RootState {
  exchange: ExchangeState;
}

export default combineReducers({
  exchange: exchangeReducer,
});
