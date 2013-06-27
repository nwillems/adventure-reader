
var d = require('./data-definitions');

function Feed(opts){
    if(opts === undefined) opts = {};
    if(!(this instanceof Feed)) return new Feed(opts);

    this.db = opts.client ||  {}; // Throw error

}

module.exports = Feed;

Feed.prototype.get = function(id, callback){
    var self = this;

    var q = self.db.query('SELECT * FROM feeds WHERE id=$1', [id], function(err, result){
        if(err) return callback(err);
        
        return callback(null, result.rows);
    });
}

Feed.prototype.getMultiple = function(ids, callback){
    var self = this;
    
    var whereEx = d.feed.id.equals(ids[0]);
    for(var i = 1; i < ids.length; i++) 
        whereEx.or(d.feed.id.equals(ids[i]));
 
    var query = d.feed.select(d.feed.id, d.feed.name, d.feed.url, d.feed.ttl)
        .from(d.feed).where(whereEx).toQuery();

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
