import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import App from './App'
import { initContract } from './utils'
import theme from './theme';



window.nearInitPromise = initContract().then(() => {
  ReactDOM.render(
    <ThemeProvider theme={theme}> {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
        <App near={window.near} />
    </ThemeProvider>,
    document.getElementById('root')
  );
}).catch(console.error)