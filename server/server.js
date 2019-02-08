const path = require('path');

const express = require('express');
const expressNunjucks = require('express-nunjucks');

const app = express();

app.set('view engine', 'njk');
app.set('views', './views');
expressNunjucks(app, { watch: true });

app.use(express.static(path.join(__dirname, '../public')));
app.disable('x-powered-by');

app.get("/slow-load/:file", (req, res, next) => {
  const delay = req.query.delayMS || 5000;
  const base = path.resolve(path.join(__dirname, '../public/test-assets'));
  const filepath = path.resolve(path.join(base, req.params.file));
  if (!filepath.startsWith(base)) return next();
  res.set('Cache-Control', 'no-store, private');
  setTimeout(() => res.sendFile(filepath, delay), delay);
});

app.get('/demos/:policyName', (req, res, next) => {
	try {
  	res.render('demos/'+req.params.policyName, {
			asJSON: req.headers.accept === 'application/json'
		});
	} catch (e) {
		next();
	}
});

app.listen(process.env.PORT, () => console.log('Server up'));
