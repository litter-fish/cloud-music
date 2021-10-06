import React from 'react';
import { Provider } from 'react-redux';

import { GlobalStyle } from './style';
import { IconStyle } from './assets/iconfont/iconfont';
import { HashRouter } from 'react-router-dom';

import { renderRoutes } from 'react-router-config';
import routes from './routes/index.js';
import store from './store';
import { Data } from './application/singers/data';

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
          <Data>
            { renderRoutes(routes) }
          </Data>
      </HashRouter>
    </Provider>
  );
}

export default App;
