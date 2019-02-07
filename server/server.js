const path = require('path');

const express = require('express');
const expressNunjucks = require('express-nunjucks');

const app = express();

app.set('view engine', 'njk');
app.set('views', './views');
expressNunjucks(app, { watch: true });

app.use(express.static(path.join(__dirname, '../public')));
app.disable('x-powered-by');

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
