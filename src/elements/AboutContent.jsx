import React  from 'react';

export default props => {
  return (
    <main className='about col-sm-9'>
      <p>Feature Policy allows you to control which origins can use which features, both in the top-level page and in embedded frames. Essentially, you write a policy, which is an allowed list of origins for each feature. For every feature controlled by Feature Policy, the feature is only enabled in the current document or frame if its origin matches the allowed list of origins.</p>
      <p>For each policy-controlled feature, the browser maintains a list of origins for which the feature is enabled, known as an allowlist. If you do not specify a policy for a feature, then a default allowlist will be used. The default allowlist is specific to each feature.</p>
      <p>Click a feature on the left to start exploring.</p>
    </main>
  );
}
