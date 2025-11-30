from dotenv import load_dotenv
from fastapi import FastAPI
import mariadb
import os
import sys

load_dotenv()

try:
    conn = mariadb.connect(
        user=os.getenv("MARIADB_USER"),
        password=os.getenv("MARIADB_PASSWORD"),
        host=os.getenv("MARIADB_HOST"),
        port=int(os.getenv("MARIADB_PORT")),
        database=os.getenv("MARIADB_DATABASE")
    )
except mariadb.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)

app = FastAPI()

@app.get("/actor/{actor_id}/movies")
def read_actor_movies(actor_id: int):
    return {"actor_id": actor_id}
