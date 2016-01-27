const expressApp = require('./server/');
const request = require('supertest');

exports.handler = function( event, context ) {

	const req = request(expressApp).get('/sig');

	Object.keys(event)
	.forEach(function (key) {
		req.query({ [key]: event[key] });
	});
	
	req.end(function(err, res){
		if (err) return context.fail(err.message);
		if (res.status < 400) {
			return context.succeed(res.text);
		} else {
			return context.fail(res.text);
		}
	});
}
