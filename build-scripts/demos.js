/**
 * Generate HTML and JSON representations of demos
 *
 * Demos share similar templates, so we can avoid
 * repitition by building them from a nunjucks
 * template layout
 */

const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

const policies = require(path.join(__dirname, '../src/data/policies.json'));
const buildDir = path.join(__dirname, '../public/demos');

if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir);

policies.forEach(pol => {
  const templatePath = path.join(__dirname, '../src/demos', pol.name + '.njk');
  const buildPath = path.join(buildDir, pol.name);
  if (fs.existsSync(templatePath)) {
    fs.writeFileSync(buildPath + '.html', nunjucks.render(templatePath));
    fs.writeFileSync(buildPath + '.json', nunjucks.render(templatePath, { asJSON: true }));
  }
});
