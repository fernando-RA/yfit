"""
Starts a blocking process until the database is ready to receive connections.
This is useful for running other scripts that require a database before
running successful.
Usage:
```python
$ python3 is_database_ready.py --database $DATABASE_URI
database connection ready!
```
"""
import time
import argparse
import psycopg2

# globals
RETRY_SECONDS = 5
MAX_RETRIES = 10


def is_database_connection_ready(connection:str, retry_seconds:int = RETRY_SECONDS, max_retries: int = MAX_RETRIES) -> bool:
    """Truthy if database connection is ready. If it isn't, then retry after `retry_seconds`."""
    # Attribute that checks if a connection is open: https://www.psycopg.org/docs/connection.html#connection.closed
    wait_message = f"database comnnection not ready; waiting {retry_seconds}s"
    retries = 0
    while True:

        # check if max retries has been reached
        if retries >= max_retries:
            print(f"max retries reached ({MAX_RETRIES}), exiting")

        # try to open connection
        try:
            connection = psycopg2.connect(connection)
        except psycopg2.OperationalError:
            print(f"[{retries}/{max_retries}] {wait_message}")
            time.sleep(retry_seconds)

            retries += 1
            continue

        # verify that connection is actually open
        if connection.closed > 0:
            print(f"[{retries}/{max_retries}] {wait_message}")
            time.sleep(retry_seconds)

            retries += 1
        else:
            print("database connection ready!")
            return True


if __name__ == '__main__':

    # pass database uri from command line
    parser = argparse.ArgumentParser()
    parser.add_argument('--database', type=str, required=True)
    parser.add_argument('--retry-seconds', type=int, default=RETRY_SECONDS, required=False)
    parser.add_argument('--max-retries', type=int, default=MAX_RETRIES, required=False)
    args = parser.parse_args()

    # check database connection
    is_database_connection_ready(connection=args.database)