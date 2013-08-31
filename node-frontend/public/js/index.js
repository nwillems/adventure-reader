
if(!window.App){
    window.App = {};
    console.log("App not defined");
}

function CreateFeedModel(obj){
    var res = new AdventureReader.FeedViewModel();
    res.id = (obj.feed_id);
    res.title = (obj.feed_title);
    res.url = (obj.feed_url);

    return res;
}

$(document).ready(function(){

});

var App = window.App;

App.Initialize = function(){

    App.Model = new AdventureReader.AdventureReaderViewModel();

    ko.applyBindings(App.Model);

    $.ajax('/api/feeds', { success: function(res){
        var feeds = res.feeds;

        App.Model.feeds.removeAll();

        for(var i = 0; i < feeds.length; i++){
            var feed = feeds[i];
            App.Model.feeds.push(CreateFeedModel(feed));
        }
        console.log(res);
    }});

    console.log("Initializing");
};
