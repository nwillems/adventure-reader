var restify = require('restify');
var pg = require('pg').native;

module.exports = function ApiRouter(opts, cb){
    var server = opts.server;

    server.use(restify.queryParser());
    server.use(restify.bodyParser({ mapParams : false }));

    var db = new pg.Client(opts.connection); // create db connection

    server.get('/api/feeds', function(req, res, next){
        db.query('SELECT * FROM feeds;', function(err, result){
            if(err) return next(err);
            res.json(200, {'feeds': result.rows});
            return next();
        });
    });

    server.get('/api/feeds/:feedid', function(req, res, next){
        console.log("Incomming get for - bogus: ", req.url);
        db.query('SELECT * FROM entries WHERE feed_id = $1 ORDER BY entry_published DESC;', 
            [req.params.feedid], 
            function(err, result){
                if(err) return next(err);
                res.json(200, {'feedinfo': {}, 'entries' : result.rows });
                return next();
            }
        );
    });

    server.get('/api', function(req, res, next){
        res.end("This is the frontpage of API server");
        next();
    });

    server.get('/api/users/:userid', function(req, res, next){
        var q = 'SELECT f.* FROM users_feeds uf'
              + ' JOIN feeds f ON uf.feed_id_feeds = f.feed_id'
              + ' WHERE id_users = $1 ORDER BY feed_id_feeds';
        db.query(q, [req.params.userid], function(err, result){
            if(err) return next(err);
            res.json(200, { 'user_feeds': result.rows });
        });
    });

    //Create a resource
    server.post('/api/users', function(req, res, next){
        var username = req.body['username'];
        var userid = req.body['userid'];
        var q = 'INSERT INTO users(username, user_ext_id) VALUES($1, $2)';

        db.query(q, [username, userid], function(err, result){
            if(err) return next(err);

            res.json(200, result);
        });
    });

    //Update
    server.put('/api/users/:userid/feeds', function(req, res, next){
        //Expect a single feed-url or id to be provided.
        res.json(200, {res: 'Added'});
    });

    server.del('/api/users/:userid/feeds/:feedid', function(req, res, next){
        //Delete the given feed for the given user
        res.json(200, {res: 'Deleted'});
    });

    //Update
    server.put('/api/users/:userid/reads/:feedid', function(req, res, next){
        //Expect either a list or single id of an entry - to mark as read for
        //  the given user
        res.json(200, {res: 'Added'});
    });

    server.del('/api/users/:userid/reads/:feedid', function(req, res, next){
        //Expect either a list or single id of an entry - to mark as unread for
        //  the given user
        res.json(200, {res: 'Added'});
    });

    db.connect(cb);

}


