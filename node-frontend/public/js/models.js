
function Feed(){
    var self = this;
        
    self.id = 0;
    self.link = ko.computed(function(){ return '#' + self.id }, this);
    self.title = "Some Feed";
    self.url = "http://example.com";

    self.entries = ko.observableArray([
        new Entry()
    ]);

    self.fetchEntries = function(cb){
        self.entries.removeAll();

        function handleResponse(result){
            console.log(result);
            var entries = result.entries;

            for(var i = 0; i < entries.length; i++)
                self.entries.push(entries[i]);
        }

        $.ajax({
            url: '/api/feeds/'+self.id,
            success: function(result){ 
                handleResponse(result);
                cb();
            }
        });
    };
}

function Entry(){
    var self = this;

    self.entry_id = 123;
    self.item_id = "ID OF ENTRY";
    self.entry_published = "2013-06-24T12:16:07.000Z";
    self.entry_title = "Tittle of entry - something interesting happening here...";
    self.entry_author = "Author Authorson";
}

var AdventureReader = {
    FeedViewModel : Feed,
    EntryViewModel : Entry,
    AdventureReaderViewModel : function(){
        var self = this;

        self.feeds = ko.observableArray([
            new Feed(),
            new Feed(),
            new Feed(),
            new Feed(),
            new Feed(),
            new Feed()
        ]);

        self.currentFeed = ko.observable(new Feed());

        self.selectFeed = function(feed){
            feed.fetchEntries(function(){
                self.currentFeed(feed);
            });
        };
    }
};
