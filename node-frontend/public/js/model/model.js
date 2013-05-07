var app = app || {};
app.models = app.models || {};

$(function(){

    app.models.FeedList = Backbone.Collection.extend({
        model: app.models.Feed
    });

    app.models.Feed = Backbone.Model.extend({
        defaults : {
            title: "Feed title",
            id: 123,
            description: "This describes the feed"
        }
    });

});
