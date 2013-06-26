var trumpet = require('trumpet');
var http = require('http');

var tr = trumpet();
var rss_tr = trumpet();
var feeds = [];

function typeIsFeed(type){
    return type === 'application/rss+xml' 
        || type === 'application/atom+xml'
        || type === 'application/rdf+xml';
}

tr.select('link', function(node){
    if(node.attributes.rel && node.attributes.rel !== 'alternate')
        return null;
    if(node.attributes.type && !typeIsFeed(node.attributes.type))
        return null;

    //All good now ready
    feeds.push({ href : node.attributes.href, type: node.attributes.type });
    getInfo(node.attributes.href);
});

function getFeed(url){
    console.log("Fetching feed for:", url);
    var req = http.get(url, function(res){
        res.pipe(tr);
    }).on('error', function(){
        console.log("Request error:", arguments);
    });
}

for(var i = 2; i < process.argv.length; i++)
    getFeed(process.argv[i]);

/*
setTimeout(function(){
    console.log('Feeds fetched after 10 sec:', feeds);
}, 1000);
*/

function getInfo(rssurl){
    var req = http.get(rssurl, function(res){
	res.pipe(rss_tr);
    }).on('error', function(){
	console.log("Request error: ", arguments);
    });
}

rss_tr.selectAll('channel > title', function(node){
    node.createReadStream().pipe(process.stdout);
    //console.log(node);
})

/*
tr.select('div > a', function(node){
    node.createReadStream().pipe(process.stdout);
})
*/
