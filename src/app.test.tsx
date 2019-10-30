import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import fetchMock from 'fetch-mock';

it('renders without crashing', () => {
  fetchMock.mock('*', { status: 200, body: { rates: {} } });
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
