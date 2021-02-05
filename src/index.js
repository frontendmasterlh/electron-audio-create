import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// ui
import "antd/dist/antd.css";
import "./style/public.css";
import "./style/app.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);