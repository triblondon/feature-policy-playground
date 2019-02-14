import React, { Component } from 'react';
import './App.css';

import * as router from './router'

import Header from './elements/Header';
import AboutContent from './elements/AboutContent';
import FeatureDetail from './elements/FeatureDetail';
import FeatureSelector from './elements/FeatureSelector';
import Footer from './elements/Footer';

import features from './data/policies-dist.json';

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeFeature: null
    }
  }

  componentDidMount() {
    router.configure({
      routes: [
        { name: 'empty', pattern: /^\/$/, action: () => this.setPolicy(null) },
        { name: 'policy', pattern: /^\/policies\/([0-9a-zA-Z%]+)\/?$/, action: params => this.setPolicy(params[1]) }
      ],
      triggerForInitialState: true
    })
  }

  setPolicy(newFeature) {
    this.setState(currentState => {
      if (currentState.activeFeature !== newFeature) {
        return {activeFeature: newFeature};
      }
    })
    router.pushState(newFeature ? '/policies/' + newFeature : '/');
  }

  render() {
    return (
      <div>
        <Header />
        <div className='container'>
          {Boolean(this.state.activeFeature) ? (
            <div className='row'>
              <FeatureDetail feature={features.find(f => f.name === this.state.activeFeature)} />
            </div>
          ) : (
            <div>
              <AboutContent />
              <FeatureSelector
                features={features}
                activeFeature={this.state.activeFeature}
                onChange={newFeature => this.setPolicy(newFeature)}
              />
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
