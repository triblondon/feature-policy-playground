import React from 'react';
import classNames from 'classnames';

export default props => {
  const features = props.features;

  const handleLinkClick = (newFeature, evt) => {
    evt.preventDefault();
    props.onChange(newFeature);
  };

  return (
    <div className='row'><div className='col-12'>
      <table className='features-list'>
        <thead>
          <tr><th>Feature</th><th>Support</th><th>Docs</th></tr>
        </thead>
        <tbody>
          {features.sort((a,b) => (a.name < b.name) ? -1 : 1).map(f => {
            const cl = classNames({
              "policy-allowed": window.featurePolicy && window.featurePolicy.allowsFeature(f.name),
            });
            return (
              <tr key={f.name}>
                <td><a href={'/features/'+f.name} className={cl} onClick={handleLinkClick.bind(null, f.name)}>{f.name}</a></td>
                <td>TODO</td>
                <td>TODO</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div></div>
  );
}
