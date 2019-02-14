import React from 'react';
import { Link } from '../router';

export default props => {
  return (
    <header>
      <div className='container'>
        <h1><Link to='/'>Feature policy playground</Link></h1>
      </div>
    </header>
  );
}
