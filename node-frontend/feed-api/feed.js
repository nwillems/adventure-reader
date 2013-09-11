
var model = require('./data-definitions');
var request = require('request');
var feedparser = require('feedparser');

var feed = model.feed;
var entries = model.entries, entry = model.entry;

function Feed(opts){
    if(opts === undefined) opts = {};
    if(!(this instanceof Feed)) return new Feed(opts);

    this.db = opts.client ||  {}; // Throw error

}

module.exports = Feed;

Feed.prototype.getAllFeeds = function(callback){
    var self = this;

    var query = 
        feed.select(feed.id, feed.title, feed.url, feed.ttl)
            .from(feed).toQuery();

    var q = self.db.query(query.text, function(err, result){
        if(err) return callback(err);

        return callback(null, result.rows);
    });
}

Feed.prototype.getById = function(id, callback){
    var self = this;

    var query = 
        feed.select(feed.id, feed.title, feed.url, feed.ttl)
            .from(feed)
            .where(feed.id.equals(id)).toQuery();

    var q = self.db.query(query.text, query.values, function(err, result){
        if(err) return callback(err);
        
        return callback(null, result.rows);
    });
}

Feed.prototype.getByUrl = function(url, callback){
    var self = this;

    var query = 
        feed.select(feed.id, feed.title, feed.url, feed.ttl)
            .from(feed)
            .where(feed.url.equals(url)).toQuery();

    var q = self.db.query(query.text, query.values, function(err, result){
        if(err) return callback(err);
        
        return callback(null, result.rows);
    });
}

Feed.prototype.getMultipleById = function(ids, callback){
    var self = this;
    
    var whereEx = d.feed.id.equals(ids[0]);
    for(var i = 1; i < ids.length; i++) 
        whereEx.or(feed.id.equals(ids[i]));
 
    var query = 
        feed.select(feed.id, feed.title, feed.url, feed.ttl)
            .from(feed).where(whereEx).toQuery();

    var q = self.db.query(query.text, query.values);

    q.on('row', function(row, result){
        result.addRow(row);
    });

    function end(result){ callback(null, result.rows); }
    q.once('end', end);

    q.once('error', function(err){
        q.removeAllListeners('end');
        return callback(err, null);
    });
};

Feed.prototype.getEntries = function(id, callback){
    var self = this;

    var query = 
        entries.select()
            .from(entries)
            .where(entry.feed.equals(id))
            .order(entry.published).toQuery();

    var q = self.db.query(query.text, query.values, function(err, result){
        if(err) return callback(err);

        return callback(null, result.rows);
    });
}

function isContentTypeFeed(contentType){
    var types = [
          'application/rss+xml'
        , 'application/atom+xml'
        , 'application/rdf+xml'
        , 'text/xml'
    ]

    for(var type in types)
        if(type === contentType) return true;
    return false;
}

Feed.prototype.getFeedInfo = function(feedUrl, callback){
    function handleFeed(headers, url){
        request(url).pipe(new FeedParser([]))
            .on('error', callback)
            .on('meta', function onMeta(meta){
                var ttl = 60;
                if(meta['#type'] === 'rss') ttl = meta['rss:ttl'] || ttl;

                return callback(null, { url : url, title: meta.title, ttl : ttl });
            }).on('error', function(err){ 
                return callback(err);
            });
    }

    request({ 
        url: feedUrl, 
        method : 'HEAD', 
        followRedirect: false
    }, function(err, resp){
        if(err) return callback(err);
        
        if(resp.statusCode == 200 && isContentTypeFeed(resp.headers['content-type'])){
            handleFeed(resp.headers, feedUrl);
        }else{
            callback({Error: "Url entered was not direct RSS feed"});
        }

        return;
    });
}

Feed.prototype._insertFeed = function(feedInfo, callback){
    var self = this;
    var query = feed.insert(
        feed.title.value(feedInfo.title),
        feed.url.value(feedInfo.url),
        feed.ttl.value(feedInfo.ttl)
    ).toQuery();

    var q = self.db.query(query.text, query.values, function(err, result){
        if(err) return callback(err);

        var affected = result.rowCount;

        return callback(null, {'msg': 'Added new feed', 'affected': affected, 'feedInfo': feedInfo });
    });
}
