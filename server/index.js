'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const ftwebservice = require('express-ftwebservice');
const path = require('path');
const app = express();
const getRSSItem = require('./lib/getRSSItem')

// Use Handlebars for templating
const hbs = exphbs.create({
	defaultLayout: 'main',
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/sig', function (req, res) {
	if (req.query.url) {
		return getRSSItem(req.query.url)
		.then(function (items) {
			const shoudDebug = !!req.query.debug;
			const limit = req.query.max || 3;
			if (!shoudDebug) {
				items.items = items.items.slice(0, limit);
			}
			res.render(shoudDebug ? 'sig-debug' : 'sig' , items);
		}, function (err) {
			res.render('error', {message: err.message});
		});
	}
	res.status(400);
	res.render('error', {
		message: 'Invalid RSS URL'
	});
});

// /__gtg, /__health, and /__about.
ftwebservice(app, {
	manifestPath: path.join(__dirname, '../package.json'),
	about: require('../runbook.json'),
	healthCheck: require('../tests/healthcheck'),
	goodToGoTest: () => Promise.resolve(true)
});

module.exports = app;
