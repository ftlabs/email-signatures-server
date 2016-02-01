'use strict';

var expressApp = require('./server/');
var request = require('supertest');

exports.handler = function( event, context ) {

	var req = request(expressApp).get('/sig');

	Object.keys(event)
	.forEach(function (key) {
		var o = {};
		o[key] = event[key];
		req.query(o);
	});
	
	req.end(function(err, res){
		if (err) return context.fail(err.message);
		if (res.status < 400) {
			return context.succeed(res.text);
		} else {
			return context.fail(res.text);
		}
	});
};
