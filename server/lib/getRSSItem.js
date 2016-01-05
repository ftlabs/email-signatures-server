'use strict';

const FeedParser = require('feedparser')
const request = require('request');
const debug = require('debug')('email-signature-server');
const moment = require('moment');

module.exports = function getRSSItem(url) {
	const req = request(url);
	const feedparser = new FeedParser();

	return new Promise(function (resolve, reject) {
		const output = [];
		let meta;

		req.on('error', function (error) {

			// handle any request errors
			debug(error); 
			reject(error);
		});

		req.on('response', function (res) {
			const stream = this;

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
			const stream = this;
			let item;
			while (item = stream.read()) {
				if (item.date) {
					item.humanDate = moment(item.date).format('LLLL'); 
				}
				output.push(item);
			}
		});

		feedparser.on('meta', metadata => meta = metadata);

		feedparser.on('finish', function() {
			resolve({
				items: output,
				meta
			});
		});
	});
}
