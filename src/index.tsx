import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AlertBoxProvider } from './context/alert';
import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthContextProvider } from './context/auth';
import { BrowserRouter as Router } from "react-router-dom";
import { store } from './redux/store'
import { Provider } from 'react-redux'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    }
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AlertBoxProvider>
        <Provider store={store}>
          <AuthContextProvider>
            <DndProvider debugMode={true} backend={HTML5Backend}>
              <Router>
                <App />
              </Router>
            </DndProvider>
          </AuthContextProvider>
        </Provider>
      </AlertBoxProvider>
    </QueryClientProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
