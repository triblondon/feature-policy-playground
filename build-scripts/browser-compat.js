/**
 * Add browser compatibility data to policies dataset
 *
 * Browser compatibility data is provided by MDN's
 * browser-compat-data module, but the file for
 * feature policy is over 50KB and we don't need to
 * ship that much data into a frontend bundle.
 */

const fs = require('fs-extra');
const path = require('path');

const mdnData = require('mdn-browser-compat-data');
const policies = require(path.join(__dirname, '../src/data/policies.json'));
const browsers = ['chrome', 'firefox', 'edge', 'safari'];

const compatData = mdnData['http']['headers']['Feature-Policy'];

policies.forEach(pol => {
  if (pol.name in compatData) {
    if (!('browserSupport' in pol)) {
      pol.browserSupport = {};
    }
    Object.entries(compatData[pol.name]['__compat']['support'])
      .forEach(([browser, data]) => {
        if (browsers.includes(browser)) {
          const mdnVersion = data['version_added'] ? Number.parseInt(data['version_added']) : false;
          const ourData = pol.browserSupport[browser];
          if (ourData === undefined) {
            pol.browserSupport[browser] = mdnVersion ? {
              minVersion: mdnVersion,
              requiresFlag: ('flags' in data) ? true : undefined
            } : false;
          } else if (ourData.minVersion && ourData.minVersion !== mdnVersion) {
            console.log(pol.name + ": Overriding MDN for " + browser + ".  MDN says " + mdnVersion + ", we say " + ourData.minVersion);
          } else if (ourData === false && mdnVersion) {
            console.log(pol.name + ": Overriding MDN for " + browser + ".  MDN says " + mdnVersion + ", we say not supported");
          } else {
            console.log(pol.name + ": Unnecessary local data for " + browser + ".  MDN has the same.");
          }
        }
      })
    ;
  } else if (pol.browserSupport) {
    console.log(pol.name + ': MDN has no data, using local data');
  }
});

fs.ensureDirSync(path.join(__dirname, '../src/_build'));
fs.writeJsonSync(path.join(__dirname, '../src/_build/policies.json'), policies);
