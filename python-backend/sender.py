import sys
import argparse
import sched
import time
import json

import amqp

import conf
import db

"""
TODO:
* Hook this up on queueing servivce
* Make it queue new/unread objects
"""

def queue_feed(feed_id, feed_url):
    """
    Puts the feed in the queue
    """

    feed_info = {'id': feed_id, 'url': feed_url }
    msg_text = json.dumps(feed_info)
    # Put msg in Queue
    con = amqp.Connection(conf.QUEUE_HOST, userid=conf.QUEUE_USER,
        password=conf.QUEUE_PASSWORD, ssl=conf.QUEUE_SSL)

    channel = con.channel()
    msg = amqp.Message(msg_text, content_type="text/plain")

    channel.basic_publish(msg, exchange='', routing_key='tester')

    channel.close()
    con.close()
    return True

def schedule_queue_feed(feed_info, scheduler):
    feed_id  = feed_info[0]
    feed_url = feed_info[1]
    feed_ttl = feed_info[2]
    
    print("Scheduling feed ", feed_url);
    
    scheduler.enter(feed_ttl * 60, # Delay times 60
                    1, # Priority
                    schedule_queue_feed,
                    ((feed_id, feed_url, feed_ttl), scheduler))
    
    queue_feed(feed_id, feed_url)
    return True

def get_feeds():
    con = db.get_connection()
    c = con.cursor()

    c.execute("SELECT feed_id, feed_url, feed_ttl FROM feeds;")
    feeds = c.fetchall()

    # Apparently recommended
    con.commit()

    c.close()
    con.close()

    return feeds

def get_feed_by_id(id):
    con = db.get_connection()
    c = con.cursor()

    c.execute("SELECT feed_id, feed_url FROM feeds WHERE feed_id=%s;", (id,))
    feed = c.fetchone()

    # Apparently recommended
    con.commit()

    c.close()
    con.close()

    return feed

def main():
    """
    Do some option parsing, 
    
    - if -h specified, show help
    - else boot up the queue process by starting the scheduler and calling the
        queue_feed method for each of the feeds in the database
    """
    parser = argparse.ArgumentParser(description="Schedule feeds in the queue")
    parser.add_argument('--feed', dest='feed', default=None, 
                        help='A feed to queue imediately')
    parser.add_argument('--list', action='store_true', default=None,
                        help='List available feeds')

    args = parser.parse_args()

    if(args.feed): # Single feed scheduling
        print("Scheduling single feed")
        # Fetch feed info from DB
        feed_id, feed_url = get_feed_by_id(int(args.feed))
        # Queue feed
        queue_feed(feed_id, feed_url)
    elif(args.list):
        print("Listing feeds(ID - url)")
        for feed in get_feeds():
            id, url,_ = feed
            print("%s - %s" % (id, url))
    else:
        print("Starting scheduler")
        # Create scheduler
        scheduler = sched.scheduler(time.time, time.sleep)
        for feed_info in get_feeds():
            schedule_queue_feed(feed_info, scheduler)
        # Read feeds from DB
        # Queue feeds imdediately
        # Start scheduler
        scheduler.run()

if __name__ == "__main__":
    main()
