import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'
import configureStore from "./store/index.js";
import * as sessionActions from "./store/session.js";
import App from './App.jsx';
import './index.css';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';

const store = configureStore;

if (process.env.NODE_ENV !== "production") {
	window.store = store;
	window.sessionActions = sessionActions;
}

const root = createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
      <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
      </BrowserRouter>
    </Provider>
);
