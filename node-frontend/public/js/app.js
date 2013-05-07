var app = app || {};

$(function () {
    var Router = Backbone.Router.extend({
        routes: {
            'login' : 'handleLogin',
            'feed/:feedid' : 'loadFeed'
        },

        handleLogin: function(){

        },
        loadFeed: function(param){

        }
    });

    app.RssRouter = new Router();
    Backbone.history.start();

    $.ajaxSetup({
        headers : { 'x-auth': 'aaaadventure' }
    });

    var appView = new app.views.AppView();


    var feed0 = new app.models.Feed();
    var feed1 = new app.models.Feed();
    var feed2 = new app.models.Feed();

    var feeds = new app.models.FeedList();

});
