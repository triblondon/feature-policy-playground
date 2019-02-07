import React from 'react';
import classNames from 'classnames';

export default props => {
  const features = props.features;

  const handleLinkClick = (newFeature, evt) => {
    evt.preventDefault();
    props.onChange(newFeature);
  };

  return (
    <nav className='col-sm-3'>
      <div className='features-list list-group list-group-flush'>
        {features.sort((a,b) => (a.name < b.name) ? -1 : 1).map(f => {
          const cl = classNames({
						"policy-allowed": window.featurePolicy && window.featurePolicy.allowsFeature(f.name),
						"list-group-item": true,
						"list-group-item-action": true
          });
          return (
            <a key={f.name} href={'/features/'+f.name} className={cl} onClick={handleLinkClick.bind(null, f.name)}>{f.name}</a>
          );
        })}
      </div>
    </nav>
  );
}
