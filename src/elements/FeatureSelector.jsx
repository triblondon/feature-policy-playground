import React from 'react';
import classNames from 'classnames';

import { Link } from '../router';

export default props => {
  const policies = props.policies;

  return (
    <div className='row'><div className='col-12'>
      <table className='features-list'>
        <thead>
          <tr><th>Policy</th><th>Support</th><th>Docs</th></tr>
        </thead>
        <tbody>
          {policies.sort((a,b) => (a.name < b.name) ? -1 : 1).map(p => {
            const cl = classNames({
              "policy-allowed": window.featurePolicy && window.featurePolicy.allowsFeature(p.name),
            });
            return (
              <tr key={p.name}>
                <td><Link to={'/policies/'+p.name} className={cl}>{p.name}</Link></td>
                <td>
                  {p.browserSupport && Object.entries(p.browserSupport).map(([browser, data]) => {
                    const classes = classNames({
                      "browser": true,
                      "requires-flag": data.requiresFlag
                    });
                    if (!data.minVersion) return false;
                    return (
                      <div key={browser} className={classes}>
                        <img src={'/browser-logos/'+browser+'.svg'} className={classes} alt={browser} />
                        {data.minVersion}
                        {data.requiresFlag && (<i className="fas fa-flag"></i>)}
                      </div>
                    );
                  })}
                </td>
                <td className='links'>
                  {p.links && p.links.filter(l => l.rel.endsWith('-mdn')).map(l => (
                    <a key={l.href} href={l.href}>{l.note || (l.rel.startsWith('feature-') ? "Feature" : "Policy")}</a>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div></div>
  );
}
