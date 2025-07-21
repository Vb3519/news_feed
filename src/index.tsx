import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import store from './app/redux/store';
import App from './app/App';

const AppContainer: HTMLElement | null = document.getElementById('root');

if (AppContainer) {
  const root: ReactDOM.Root = ReactDOM.createRoot(AppContainer);

  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}
