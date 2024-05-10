import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from "./store/index.js";
import * as sessionActions from "./store/session.js";
import App from './App.jsx';
import './index.css';

const store = configureStore;

if (process.env.NODE_ENV !== "production") {
	window.store = store;
	window.sessionActions = sessionActions;
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
