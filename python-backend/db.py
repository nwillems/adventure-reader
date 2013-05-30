import sys
import psycopg2

from conf import DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE

_connection = None

def get_connection():
    if not _connection:
        _connection = psycopg2.connect(
            database=DB_DATABASE,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST
        )
    return _connection

def get_cursor(connection):
    return connection.cursor()
