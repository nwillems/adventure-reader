import sys
import amqp
from functools import partial

def callback(channel, msg):
    print ("received: %s" % msg.body)
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
