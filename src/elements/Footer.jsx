import React from 'react';

export default props => {
  return (
    <footer className='text-muted'>
      <div className='container'>
        <ul className='footer-links'>
          <li><a href='https://github.com/triblondon/feature-policy-playground'>GitHub repo</a></li>
          <li><a href='https://twitter.com/triblondon'>Follow me on twitter</a></li>
        </ul>
        <p>Created by <a href='https://trib.tv/'>Andrew Betts</a>.  MIT Licence, unless otherwise indicated.</p>
      </div>
    </footer>
  );
}
