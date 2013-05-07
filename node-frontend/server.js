var http = require('http');
var filed = require('filed');

var dir = require('path').join(__dirname, 'public');


var server = http.createServer(function(req, res){
	if(req.method !== 'GET') return res.end('Not supported');
	
	if(req.url === '/') req.url = '/index.html';
	
    var f = filed(dir + req.url);
	
	req.pipe(f).pipe(res);
	return;
});

server.listen(8080, function(){
    console.log('Server running');
});
