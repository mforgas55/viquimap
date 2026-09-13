import os
import psycopg2
from dotenv import load_dotenv

load_dotenv() #Carrega variables de .env

def get_connection():
    try:
        return psycopg2.connect(
            database=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
        )
    except:
        return False

