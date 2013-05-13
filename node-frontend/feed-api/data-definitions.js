var sql = require('sql');

exports.feed = sql.define({
    name: 'feed';
    columns: ['id', 'name', 'url', 'ttl']
});
