import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './App';
import './index.css';
import {ThemeProvider} from "./app/providers/ThemeProvider";

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <ThemeProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

