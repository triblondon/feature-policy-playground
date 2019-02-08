import React from 'react';
import ReactMarkdown from 'react-markdown';
import Highlight from 'react-highlight.js';

import TestResult from './TestResult';

function generateRandomID() {
  return Math.round(Math.random() * 100000);
}

class FeatureDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      feature: null,
      policyAllowed: true,
      demoID: null,
      demoCode: null
    }
  }

	componentDidMount() { this.resetAndLoad(); }
  componentDidUpdate() { this.resetAndLoad(); }

  setPolicyAllowed(isAllowed) {
    this.setState({
      policyAllowed: Boolean(isAllowed),
      demoID: this.state.demoID ? generateRandomID() : null
    });
  }

	async resetAndLoad() {
		if (this.props.feature.name !== this.state.feature) {
			this.setState({ feature: this.props.feature.name, policyAllowed: true, demoID: null, demoHtml: null, demoScript: null });
			const demoFetch = await fetch('/demos/' + this.props.feature.name, { headers: { Accept: 'application/json' } });
			if (demoFetch.ok) {
				const demoCode = await demoFetch.json();
				if (demoCode.script || demoCode.html) {
					return this.setState({
						demoID: generateRandomID(),
						demoCode
					});
				}
			}
		}
	}

  render() {
    const feature = this.props.feature;
    const linkLabels = {
      "policy-spec": "Specification for " + feature.name + " feature policy",
      "policy-mdn": feature.name + " feature policy on MDN",
      "feature-spec": "Feature specification",
      "feature-mdn": "Documentation for the feature on MDN"
		};
    const exampleHeader = `Feature-Policy: ${feature.name} 'none'`;

    // Show default as not supported for browsers where there is no FP
    const browsers = { firefox: "Mozilla Firefox", chrome: "Google Chrome", edge: "Microsoft Edge", safari: "Apple Safari" };
    const browserSupport = Object.assign({
      edge: false,
      safari: false
    }, feature.browserSupport);

    return (
      <main className='feature col-sm-9'>
        <div className='feature-header'>
					{Boolean(feature.tags) && (
						<div className='tags'>
							{feature.tags.map(tag => (<span key={tag} className='badge badge-light'>{tag}</span>))}
						</div>
					)}
          <h2>{feature.name}</h2>
        </div>

        {Boolean(feature.description) && (
          <div className='feature-description lead'>
            <ReactMarkdown source={feature.description} />
          </div>
        )}

				<section className='setup-instructions'>
        	<h3>How to apply this policy</h3>
        	<p>Send the following HTTP header to control the <code>{feature.name}</code> policy, and disallow it on all origins:</p>
        	<Highlight language='http'>{exampleHeader}</Highlight>
				</section>

        {Boolean(this.state.demoID) && (
          <section className='test-case'>
            <div className='policy-toggle'>
							<h3>Affected use case example</h3>
							<div className="custom-control custom-switch">
								<input
									type="checkbox"
									className="custom-control-input"
									id="policyToggle"
									checked={this.state.policyAllowed}
									onChange={evt => this.setPolicyAllowed(evt.target.checked)}
								/>
								<label className="custom-control-label" htmlFor="policyToggle">Allow policy</label>
							</div>
            </div>
						<div className="demo-container row px-sm-2 mx-sm-0">
							<div className="demo-code-blocks col-lg-6 px-sm-2">
                {Boolean(this.state.demoCode.css) && (
                  <div>
								    <h4>CSS</h4>
            		    <Highlight language='css'>{this.state.demoCode.css}</Highlight>
                  </div>
                )}
                {Boolean(this.state.demoCode.html) && (
                  <div>
								    <h4>HTML</h4>
            		    <Highlight language='html'>{this.state.demoCode.html}</Highlight>
                  </div>
                )}
                {Boolean(this.state.demoCode.script) && (
                  <div>
								    <h4>JavaScript</h4>
            		    <Highlight language='javascript'>{this.state.demoCode.script}</Highlight>
                  </div>
                )}
							</div>
							<div className='demo-output col-lg-6 px-sm-2'>
								<h4>Output</h4>
								<iframe
									title='Demo output'
									src={'/demos/'+feature.name+'?demoID='+this.state.demoID}
									allow={feature.name + ' ' + (this.state.policyAllowed ? '*' : "'none'")}
								/>
							</div>
						</div>
						<TestResult id={this.state.demoID} expectToWork={this.state.policyAllowed} />
          </section>
        )}

        <section className='does-it-work'>
          <h3>Does it work?</h3>
          <p>Currently Chromium based browsers, such as Google Chrome, Samsung Internet, and Opera, are the only user-agents to support Feature Policy.  The minimum version that correctly recognises the <code>{feature.name}</code> policy is:</p>
          <div className='row'>
            {Object.entries(browsers).map(([key, name]) => {
              const status = ((key in browserSupport) ? (browserSupport[key] ? 'supported' : 'unsupported') : 'unknown');
              return (
                <div key={key} className='col-lg-3 col-sm-6'>
                  <div className={'browser-support card ' + status}>
                    <img src={'/browser-logos/'+key+'.svg'} className="card-img-top" alt={name}></img>
                    <div className="card-body">
                    {(status === 'supported') && (<p className='card-text'><i className="fas fa-check-circle"></i>{browserSupport[key].minVersion}+</p>)}
                    {(status === 'unsupported') && (<p className='card-text'><i className="fas fa-times-circle"></i>Not supported</p>)}
                    {(status === 'unknown') && (<p className='card-text'>Unknown</p>)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {Boolean(feature.links) && (
          <section className='links'>
            <h3>See also</h3>
            <ul>
              {feature.links.map(lnk => (
                <li key={lnk.href}>
                  <a href={lnk.href} className={lnk.rel}>{linkLabels[lnk.rel]}{lnk.note && " ("+lnk.note+")"}</a>
                </li>
              ))}
            </ul>
          </section>
        )}

      </main>
    );
  }
}

export default FeatureDetail;
