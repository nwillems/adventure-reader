PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS blogs (
    blog_id INTEGER PRIMARY KEY,
    blog_url TEXT
);

CREATE TABLE IF NOT EXISTS logs (
    log_id INTEGER PRIMARY KEY,
    blog_id INTEGER DEFAULT 0 REFERENCES blog(blog_id) ON DELETE SET DEFAULT,
    log_start INTEGER,
    log_end INTEGER 
);
CREATE INDEX logindex ON logs(blog_id);

CREATE TABLE IF NOT EXISTS entries (
    entry_id TEXT UNIQUE ON CONFLICT IGNORE,
    entry_published TEXT,
    entry_title TEXT,
    entry_author TEXT,
    blog_id INTEGER NOT NULL,
    FOREIGN KEY(blog_id) REFERENCES blogs(blog_id) ON DELETE CASCADE
);
CREATE INDEX entry_blog_index ON entries(blog_id);

INSERT INTO blogs VALUES(0, "N/A"); -- ID 0
INSERT INTO blogs VALUES(1, "http://rss1.smashingmagazine.com/feed/?f=coding-std"); -- ID 1
INSERT INTO blogs VALUES(2, "http://www.version2.dk/it-nyheder/rss"); -- ID 2

ALTER TABLE blogs ADD COLUMN blog_title TEXT;

UPDATE blogs SET blog_title = "Version2 - it for professionelle" WHERE blog_id = 2;

UPDATE blogs SET blog_title = "Smashing Magazine Feed" WHERE blog_id = 1;
