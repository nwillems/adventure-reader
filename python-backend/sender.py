import sys
import amqp

def send(msg_body):
    print("Sending ", msg_body) 
    connection = amqp.Connection('127.0.0.1', userid='guest', password='guest',
        ssl=False)

    channel = connection.channel()

    msg = amqp.Message(msg_body, content_type='text/plain',
        application_headers={'header1': 42, 'Header2': 1337 })

    channel.basic_publish(msg, exchange='', routing_key='tester')

    channel.close()
    connection.close()

send("Test besked")
