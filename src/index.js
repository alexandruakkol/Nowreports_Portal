import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration.js';

////// ======= globals setup ======= \\\\\\
window.appdata = {};
window.appdata.API_ADDR = process.env.REACT_APP_ENV == 'production' 
    ? 'https://ceochat.nowreports.com/api' 
    : '';
window.appdata.AI_API_ADDR = 'http://127.0.0.1:5001'; //TODO
window.appdata.SEC_BASE_ADDR = 'https://www.sec.gov/Archives/edgar/data/';

// console deactivation in production
if (process.env.REACT_APP_ENV === 'production') {
    console.log = function() {}
    console.error = function() {}
}

//for PWA
serviceWorkerRegistration.register();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);


