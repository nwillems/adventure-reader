import sys
import json
from functools import partial

import amqp

import feeds

def callback(channel, msg):
    print ("received: %s" % msg.body)
    feed_info = json.loads(msg.body)

    entries = feeds.fetch_feed(feed_info.url, feed_info.id)
    feeds.save_feed_entries(entries)

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
