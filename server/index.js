'use strict';

var express = require('express');
var exphbs = require('express-handlebars');
var ftwebservice = require('express-ftwebservice');
var path = require('path');
var app = express();
var qs = require('qs');
var getRSSItem = require('./lib/getRSSItem');

// Use Handlebars for templating
var hbs = exphbs.create({
	defaultLayout: 'main',
	helpers: {
		ifEq: function(a, b, options) { return (a === b) ? options.fn(this) : options.inverse(this); }
	}
});

var FTCampTracking = "engage/extensions/reach/gmail_sig/rss_articles/ftlabs";

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/sig', function (req, res) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	if (req.query.url) {
		return getRSSItem(decodeURIComponent(req.query.url))
		.then(function (items) {
			var shoudDebug = !!req.query.debug;
			var limit = req.query.max || 3;
			var theme = req.query.theme || 'pink';
			var omits = req.query.omit ? req.query.omit.split(',') : [];

			if (!shoudDebug) {
				items.items = items.items.slice(0, limit);
			}

			if (omits.length) {
				items.items.forEach(function (item) {
					omits.forEach(function (key) {
						item[key] = undefined;
					});
				});
			}

			items.size = req.query.size || 'full';

			if (omits.indexOf('heading') > -1){
				delete items.meta.description;
			}

			items.items.forEach(function (item) {
				var urlParts = item.link.split('?');
			 	var params = qs.parse(urlParts[1]);
			 	params['ftcamp'] = FTCampTracking;
			 	item.link = urlParts[0] + '?' + qs.stringify(params);
				return item;
			})

			res.render(shoudDebug ? 'signature-debug' : 'signature-' + theme, items, function(err, html) {
				if (err) {
					if (err.message.indexOf('Failed to lookup view') !== -1) {
						return res.render('signature-pink', items);
					}
					throw err;
				}
				res.send(html);
			});
		}, function (err) {
			res.status(400);
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
	goodToGoTest: function () {
		return Promise.resolve(true);
	}
});

module.exports = app;
