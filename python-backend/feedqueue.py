import sys
import argparse
import sched
import time
import json

import amqp

# from conf import QUEUE_*
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
    msg = json.dumps(feed_info)
    # Put msg in Queue
    return True

def schedule_queue_feed(feed_id, feed_url, feed_ttl):
    queue_feed(feed_id, feed_url)
    # PUT BACK IN SCHEDULER
    return True

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

    args = parser.parse_args()

    if(not args.feed): # Single feed scheduling
        print("Scheduling single feed")
        # Fetch feed info from DB
        # Queue feed
    else:
        # Create scheduler
        # Read feeds from DB
        # Queue feeds imdediately
        # Start scheduler

if __name__ == "__main__":
    main()
