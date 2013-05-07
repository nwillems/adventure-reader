var restify = require('restify');

var server = restify.createServer();

server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/api/user/:userid', function(req, res, next){
    if(!req.header('x-auth')){
        return next(new Error("Unfortunately, you are not authorized"));
    }

    console.log("Auth info for userid: ", req.params.userid, req.header('auth'));
    res.json(200, {
        'msg':"Great sucess, here all your feeds will come",
        'feeds': [
            { 'name': 'feed0', 'id': 0 },
            { 'name': 'feed1', 'id': 1 },
        ]
    });
    return next();
});

//PUT Updates a resource
server.put('/api/user/:userid', function(req, res, next){
    //TODO: Add authentication
    if(!req.header('x-auth')){
        return next(new Error("Unfortunately, you are not authorized"));
    }
    //TODO: Add reading of feed to add
    res.json(200, {'msg': "Your feed has been added", 'feedid': 1});
    return next();
});

// POST creates a resource
server.post('/api/user/', function(req, res, next){
    //TODO: Validate user information
    res.json(201, {'auth':"FOOO", 'msg': "User has been created for your id", 'location':"/api/user/YourID"});
    return next();
});


server.get('/api/feed/:feedid', function(req, res, next){
    console.log("Incomming get for: ", req.url);
    res.json(200, {
        'feedinfo': { 'name': "Foo blog", 'description': "Maybe you just want a quiet blog" },
        'articles':[
            { 'title':"Have a nice day", 'date': 1364436310 },
            { 'title':"Have a day", 'date': 1364436311 },
            { 'title':"Have a ", 'date': 1364436312 },
            { 'title':"Have ", 'date': 1364436313 },
            { 'title':"a nice day", 'date': 1364436314 },
            { 'title':"nice day", 'date': 1364436315 },
            { 'title':"day", 'date': 1364436316 },
            { 'title':"Good bye chuck", 'date': 1364436317 }
        ]
    });
    res.end();
    next();
});

server.get('/api', function(req, res, next){
    res.end("This is the frontpage of API server");
    next();
});

server.listen(8081, function(){
    console.log("Server listening:", server.name, server.url);
});
