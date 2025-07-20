import ReactDOM from 'react-dom/client';

import App from './app/App';

const AppContainer: HTMLElement | null = document.getElementById('root');

if (AppContainer) {
  const root: ReactDOM.Root = ReactDOM.createRoot(AppContainer);

  root.render(<App />);
}
