import React from 'react';
import { Exchange } from './containers/exchange.container';
import styled from 'styled-components';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware()));

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: auto;
  min-width: 300px;
  max-width: 500px;
  padding: 0 40px;
  background: #fff;
  ::before {
    position: fixed;
    content: ' ';
    bottom: 0;
    right: 0;
    width: 100%;
    height: 50%;
    background: #f8f8f8;
  }
`;

export default function App() {
  return (
    <Provider store={store}>
      <AppWrapper>
        <Exchange />
      </AppWrapper>
    </Provider>
  );
}
