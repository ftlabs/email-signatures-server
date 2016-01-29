'use strict';

var FeedParser = require('feedparser')
var request = require('request');
var debug = require('debug')('email-signature-server');
var moment = require('moment');

module.exports = function getRSSItem(url) {
	var req = request({
		url: url,
		followRedirect: true,
		headers: {
			'User-Agent' : 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'
		}
	});
	var feedparser = new FeedParser();

	return new Promise(function (resolve, reject) {
		var output = [];
		var meta;

		req.on('error', function (error) {

			// handle any request errors
			debug(error); 
			reject(error);
		});

		req.on('response', function (res) {

			var stream = this;

			if (res.statusCode !== 200) {
				return this.emit('error', new Error('Bad status code'));
			}

			stream.pipe(feedparser);
		});


		feedparser.on('error', function(error) {

			// always handle errors
			debug(error); 
			reject(error);
		});

		feedparser.on('readable', function() {

			// This is where the action is!
			var stream = this;
			var item;
			while (item = stream.read()) {
				if (item.date) {
					item.humanDate = moment(item.date).format('LLLL'); 
				}
				output.push(item);
			}
		});

		feedparser.on('meta', function (metadata) {
			meta = metadata
		});

		feedparser.on('finish', function() {
			resolve({
				items: output,
				meta: meta
			});
		});
	});
}
