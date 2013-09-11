#! /usr/bin/env python3
import sys
import pprint
import logging
from time import time

import feedparser

from psycopg2 import IntegrityError, errorcodes
import db

# ========= CONFIGURATION =========
log_file = "./log_rsstat.log"
log_level = logging.INFO
log_format = "%(asctime)s - %(levelname)s: %(message)s"
log_datefmt = "%Y-%m-%d %H:%M:%S"
# DONE WITH CONF

printer = pprint.PrettyPrinter(depth = 1)
logging.basicConfig(filename=log_file, level=log_level, format=log_format, \
    datefmt=log_datefmt)

logger = logging.getLogger('rss_fetcher')

def log(blogid, start):
    print("Nothing")
    return False

    #con = sqlite3.connect(db_file)
    #conn = psycopg2.connect(database="test", user="postgres", password="secret")
#    con = psycopg.connect(db_file)
#    c = con.cursor()
#    c.execute(
#        "INSERT INTO logs(blog_id, log_start, log_end) VALUES(?,?,?)",
#        (blogid, start, int(time())))
#    con.commit()
#    c.close()

def mkDate(published_parsed):
    year, month, day, hour, minute, second, dayOfWeek, dayOfYear, dstFlag = published_parsed
    return "%(year)04d-%(month)02d-%(day)02d %(hour)02d:%(minute)02d:%(second)02d" % \
        {"year":year, "month":month, "day":day, "hour":hour, "minute":minute, "second":second}

def save_feed_entries(entries):
    """
    Stores the given list of entries in the database

    Arguments:
    * feed_id - id of the feed to store the entries under
    * entries - a list of feed entries 
    """
    cursor = db.get_cursor(db.get_connection())

    insert_stmt = """INSERT INTO entries(
        item_id, 
        entry_published,
        entry_title,
        entry_author,
        entry_link,
        feed_id
        ) VALUES ( %s, %s, %s, %s, %s, %s );"""

    for entry in entries:
        try:
            cursor.execute(insert_stmt, entry)
            cursor.connection.commit()
        except IntegrityError as ie:
            err = errorcodes.lookup(ie.pgcode)
            if(err != 'UNIQUE_VIOLATION'): # Unique violation
                logger.info("Integrity error: %s", ie)
                raise
            cursor.connection.rollback()

    cursor.connection.commit() # Probably not neccesary

    cursor.close()

    return True

def fetch_feed(feed_url, feed_id):
    feed = feedparser.parse(feed_url)
    entries = feed['entries']

    logging.info("Loading: %s; #entries: %s", feed_url, str(len(entries)))
    entries_simple = [(item['id'], mkDate(item['published_parsed']), 
        item['title'], item['author'], item["link"], feed_id) for item in entries]

    printer.pprint(entries[0])

    return entries_simple


def getFeedInfo(feed_url):
    feed = feedparser.parse(feed_url).feed
    return (feed.title, feed.link)    

def main():
    #conn = sqlite3.connect(db_file)
    conn = db.get_connection() 
    blog_c = db.get_cursor(conn)
    
    if len(sys.argv) > 2 and sys.argv[1] == "create" :
        # Do some fetching of the URL - such that 1. we check it exists and
        # works, 2 get title and link
        if len(sys.argv) < 3:
            print("A url is needed when creating")
            return -1
        feed_url = sys.argv[2]
        feed_title, feed_link = getFeedInfo(feed_url)
        blog_c.execute("INSERT INTO blogs(blog_url,blog_title) VALUES(?,?)",
            (feed_url,feed_title)
        )
        conn.commit()
        blog_c.close()
    elif len(sys.argv) > 1 and sys.argv[1] == "logs" :
        print("Printing logs")
    elif len(sys.argv) > 1 and sys.argv[1] == "list":
        print("Listing feeds")
        blog_c.execute("SELECT feed_id, feed_url, feed_ttl, feed_title FROM feeds WHERE feed_id > 0;")

        blogs = blog_c.fetchall()
        blog_c.close()
        
        print(blogs)
    elif len(sys.argv) > 2 and sys.argv[1] == "fetch":
        print("Fetching feed")
        blog_id = int(sys.argv[2])
        blog_c.execute("SELECT feed_id, feed_url FROM feeds WHERE feed_id = %s;", 
            (blog_id,))

        blog = blog_c.fetchall()[0]
        blog_c.close()

        print("Now fetching feed")
        entries = fetch_feed(blog[1], blog[0])
        print("Fetched feed, now storing")
        save_feed_entries(entries)
    else:
        blog_c.execute("SELECT blog_id, blog_url FROM blogs WHERE blog_id > 0;")

        blogs = blog_c.fetchall()
        blog_c.close()

        for blog in blogs:
            start = int(time())
            entries = fetch_feed(blog[1], blog[0])
            save_feed_entries(entries)
            # log(blog[0], start)


if __name__ == "__main__":
    main()
