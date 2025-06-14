import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import {Provider} from "react-redux";
import store from "./Store/store.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import ThemeProvider from './theme/ThemeProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <Provider store={store}>
          <GoogleOAuthProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </GoogleOAuthProvider>
        </Provider>
    </BrowserRouter>
  </React.StrictMode>
)
