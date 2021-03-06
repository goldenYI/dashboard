var http = require('http');

var connect = require('connect');
var bodyParser = require('body-parser');

var rest = require('../lib/connect-rest');

var server;
var app = connect()
	.use( bodyParser.urlencoded( { extended: true } ) )
	.use( bodyParser.json() )
	;

var options = {
	context: '/api',
	logger:{ file: 'mochaTest.log', level: 'debug' },
	apiKeys: [ '849b7648-14b8-4154-9ef2-8d1dc4c2b7e9' ]
};
app.use( rest.rester( options ) );

rest.get({
	path:"/:section/:fnc/*data",
	unprotected: true
}, function(request, content, callback){
	console.log('?????');
	callback( null, 'Done.' );
});

rest.get({
	path:"/a",unprotected:true
}, function(req,ct,cb){
	console.log('!!!!!!!');
	return cb(null, "oi");
});

var port = process.env.PORT || 8080;
server = http.createServer(app);

server.listen( port, function() {
	console.log('Running on http://localhost:8080');
});
