import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

window.featurePolicy = document.featurePolicy || document.policy;

ReactDOM.render(<App />, document.getElementById('root'));

