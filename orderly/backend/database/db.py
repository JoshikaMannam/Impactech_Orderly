import mysql.connector
from mysql.connector import pooling
from dotenv import load_dotenv
import os

load_dotenv()

db_config = {
    "host":       os.getenv("DB_HOST", "localhost"),
    "port":       int(os.getenv("DB_PORT", 3306)),
    "user":       os.getenv("DB_USER", "root"),
    "password":   os.getenv("DB_PASSWORD", ""),
    "database":   os.getenv("DB_NAME", "orderly"),
    "autocommit": False,
}

connection_pool = pooling.MySQLConnectionPool(
    pool_name="orderly_pool",
    pool_size=10,
    **db_config
)

def get_db():
    conn = connection_pool.get_connection()
    try:
        yield conn
    finally:
        conn.close()