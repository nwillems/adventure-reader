
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

App.getUserID = function(){
    if(App.profile){
        return App.profile.id;
    }
    return 0;
}

App.Initialize = function(){

    App.Model = new AdventureReader.AdventureReaderViewModel();

    ko.applyBindings(App.Model);

    $.ajax({ 
        url: '/api/feeds', 
        success: function(res){
            var feeds = res.feeds;

            App.Model.feeds.removeAll();

            for(var i = 0; i < feeds.length; i++){
                var feed = feeds[i];
                App.Model.feeds.push(CreateFeedModel(feed));
            }
            console.log(res);
        }
    });

    $.ajax({
        url: '/api/users',
        type: 'POST',
        data: { 'username' : App.profile.displayName , 'userid': App.getUserID() },
        success: function(result){
            console.log(result);
        }
    });

   $('#addFeed').on('click', null, null, function(e){
        //Show input field
        $.ajax({
            url : '/api/users/'+App.getUserID()+'/feeds',
            type: 'PUT',
            data: { url: $('#feedToAdd')[0].value },
            success: function(){
                console.log("Added feed", arguments);
            }
        });
   });

};
