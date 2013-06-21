import sys
import json
from functools import partial

import amqp

import conf
import rss_fetcher 

def callback(channel, msg):
    print ("received: %s" % msg.body)
    feed_info = json.loads(str(msg.body))

    entries = rss_fetcher.fetch_feed(feed_info['url'], feed_info['id'])
    rss_fetcher.save_feed_entries(entries)

    channel.basic_ack(msg.delivery_tag)

def work():
    conn = amqp.Connection("127.0.0.1", userid="guest", password="guest", ssl=False)

    ch = conn.channel()

    qname = "tester"
    #ch.queue_bind(qname, "")
    ch.basic_consume(qname, callback=partial(callback, ch))

    while ch.callbacks:
        ch.wait()

    ch.close()
    conn.close()

work()
