var restify = require('restify');
var ApiServer = require('./api-server.js');

var server = restify.createServer();

var router = new ApiServer({
    server : server,
    connection: 'tcp://adventure:adventure@192.168.1.8/adventure'
}, ready);

function ready(err){
    if(err) return console.log(err);
    server.listen(8081, function(){ 
        console.log("Server listening:", server.name, server.url);
    });
}
