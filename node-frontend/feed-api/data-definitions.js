var sql = require('sql');

// exports.DEFAULT = sql

exports.feed = sql.define({
	name: 'feeds',
	columns: [
		{ name: 'feed_id', property: 'id' },
		{ name: 'feed_title', property: 'title' },
		{ name: 'feed_url', property: 'url' },
		{ name: 'feed_ttl', property: 'ttl' }
	]
});

exports.entry = sql.define({
	name: 'entries',
	columns: [
		{ name: 'entry_id', property: 'id' },
		{ name: 'item_id', property: 'item_id' },
		{ name: 'feed_id', property: 'feed' },
		{ name: 'entry_published', property: 'published' },
		{ name: 'entry_title', property: 'title' },
		{ name: 'entry_author', property: 'author' }
	]
});

exports.entries = exports.entry; //Alias

exports.user = sql.define({
	name: 'users',
	columns: [
		{ name: 'id' },
		{ name: 'username' },
		{ name: 'user_ext_id' }
	]
});

exports.read = sql.define({
	name: 'read',
	columns: [
		{ name: 'entry_id_entries' },
		{ name: 'id_users' }
	]
});

exports.users_feeds = sql.define({
	name: 'users_feeds',
	columns: [
		{ name: 'feed_id_feeds' },
		{ name: 'id_users' }
	]
});



