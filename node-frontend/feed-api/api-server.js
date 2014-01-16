var restify = require('restify');
var pg = require('pg').native;

var Feed = require('./feed.js');

module.exports = function ApiRouter(opts, cb){
    var server = opts.server;
    server.use(restify.queryParser());
    server.use(restify.bodyParser({ mapParams : false }));

    var db = new pg.Client(opts.connection); // create db connection
    
    var feed = new Feed({ client : db });

    server.get('/api', function(req, res, next){
        res.end("This is the frontpage of API server - here should be some documentation");
        return next();
    });

    server.get('/api/feeds', function(req, res, next){
        feed.getAllFeeds(function(err, result){
            if(err) return next(err);

            res.json(200, {'feeds': result});
            return next();
        });
    });

    server.get('/api/feeds/:feedid', function(req, res, next){
        console.log("Incomming get for entries in feed: ", req.url);
        feed.getEntries(req.params.feedid, function(err, result){
            if(err) return next(err);
            
            res.json(200, {'feedinfo': {}, 'entries' : result });
            return next();
        });
    });

    server.put('/api/feeds', function(req, res, next){
        console.log("Incomming request to add feed", req.body['url']);
        var feedUrl = req.body['url'];

        feed.getByUrl(feedUrl, function(err, rows){
            if(err) return next(err);

            if(rows.length > 0){ //Feed already exsists
                res.json(200, { feed: rows[0] }); //expecting only one result
                return next();
            }

            feed.getFeedInfo(feedUrl, function(err, feedInfo){
                if(err) return next(err);
                
                feed.insertFeed(feedInfo, function(err, info){
                    if(err) return next(err);
                    
                    res.json(200, info);
                    return next();
                });
            });
        });
    });

    server.get('/api/users/:userid', function(req, res, next){
        var q = 'SELECT f.* FROM users_feeds uf'
              + ' JOIN feeds f ON uf.feed_id_feeds = f.feed_id'
              + ' JOIN users u ON u.id = uf.id_users'
              + ' WHERE u.user_ext_id = $1 ORDER BY feed_id_feeds;';
        db.query(q, [req.params.userid], function(err, result){
            if(err) return next(err);

            res.json(200, { 'user_feeds': result.rows });
            return next();
        });
    });

    //Create a resource
    server.post('/api/users', function(req, res, next){
        var username = req.body['username'];
        var userid = req.body['userid'];
        var q = 'INSERT INTO users(username, user_ext_id) VALUES($1, $2);';

        db.query(q, [username, userid], function(err, result){
            if(err) return next(err);

            res.json(200, result);
            return next();
        });
    });

    //Update
    server.put('/api/users/:userid/feeds', function(req, res, next){
        //Expect a single feed-url or id to be provided.
        var userId = req.params.userid;
        var feedId = req.body['feed_id'];
        console.log("Incomming request for adding feed to user", {userid: userId, feed_id: feedId });

        var q = 'INSERT INTO users_feeds(feed_id_feeds, id_users)'
            + ' SELECT $1, u.id FROM users u'
            + ' WHERE u.user_ext_id = $2;';

        res.json(200, {res: 'Added'});
        return next();
    });

    server.del('/api/users/:userid/feeds/:feedid', function(req, res, next){
        //Delete the given feed for the given user
        res.json(200, {res: 'Deleted'});
        return next();
    });

    db.connect(cb);

}


