import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

window.featurePolicy = document.featurePolicy || document.policy;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

ReactDOM.render(<App />, document.getElementById('root'));

