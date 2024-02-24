import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';

////// ======= globals setup ======= \\\\\\
window.appdata = {};
window.appdata.API_ADDR = 'http://www.nowreports.com/api';
window.appdata.AI_API_ADDR = 'http://127.0.0.1:5001'; //TODO
window.appdata.SEC_BASE_ADDR = 'https://www.sec.gov/Archives/edgar/data/';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);


