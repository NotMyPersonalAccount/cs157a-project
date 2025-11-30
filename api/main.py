from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

cursor = conn.cursor()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/movies")
def get_movies():
    cursor.execute("SELECT id, title, plot, release_date, runtime, rating, genre, image_url FROM movies")

    # This is why we like ORMs...
    return [{
        "id": row[0],
        "title": row[1],
        "plot": row[2],
        "release_date": row[3],
        "runtime": row[4],
        "rating": row[5],
        "genre": row[6],
        "image_url": row[7]
    } for row in cursor.fetchall()]
