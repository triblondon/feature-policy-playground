import React, { Component } from 'react';
import './App.css';

import Header from './elements/Header';
import AboutContent from './elements/AboutContent';
import FeatureDetail from './elements/FeatureDetail';
import FeatureSelector from './elements/FeatureSelector';
import Footer from './elements/Footer';

import features from './data/features.json';

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeFeature: null
    }
  }

  setFeature(newFeature) {
    this.setState(currentState => {
      if (currentState.activeFeature !== newFeature) {
        return {activeFeature: newFeature};
      }
    })
  }

  render() {
    return (
      <div>
        <Header />
        <div className='container'>
          <div className='row'>
            <FeatureSelector
              features={features}
              activeFeature={this.state.activeFeature}
              onChange={newFeature => this.setFeature(newFeature)}
            />
            {Boolean(this.state.activeFeature) ? (
              <FeatureDetail feature={features.find(f => f.name === this.state.activeFeature)} />
            ) : (
              <AboutContent />
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
