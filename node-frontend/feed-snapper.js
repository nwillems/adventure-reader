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

tr.selectAll('link', function(node){
    if(node.attributes.REL && node.attributes.REL !== 'alternate')
        return null;
    if(node.attributes.TYPE && !typeIsFeed(node.attributes.TYPE))
        return null;

    //All good now ready
    feeds.push({ href : node.attributes.HREF, type: node.attributes.TYPE });
    console.log(node.attributes);
    getInfo(node.attributes.HREF);
});

function getFeed(url){
    console.log("Fetching site for:", url);
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
    console.log("Fetching feed for:", rssurl);
    var req = http.get(rssurl, function(res){
	res.pipe(rss_tr);
    }).on('error', function(){
	console.log("Request error: ", arguments);
    });
}

rss_tr.selectAll('channel > title', function(node){
    console.log("Title for feed:");
    node.createReadStream().pipe(process.stdout);
    //console.log(node);
})

/*
tr.select('div > a', function(node){
    node.createReadStream().pipe(process.stdout);
})*/
