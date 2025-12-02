from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
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

@app.get("/movies/{movie_id}")
def get_movie(movie_id: int):
    cursor.execute("SELECT id, title, plot, release_date, runtime, rating, genre, image_url FROM movies WHERE id = ?", (movie_id,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    movie = {
        "id": row[0],
        "title": row[1],
        "plot": row[2],
        "release_date": row[3],
        "runtime": row[4],
        "rating": row[5],
        "genre": row[6],
        "image_url": row[7],
        "director": None,
        "cast": []
    }
    
    cursor.execute("""
        SELECT 
            p.id,
            p.name,
            p.image_url,
            mp.role,
            mp.character_name
        FROM movie_people mp
        JOIN people p ON mp.person_id = p.id
        WHERE mp.movie_id = ?
    """, (movie_id,))
    
    for cast_row in cursor.fetchall():
        person = {
            "person_id": cast_row[0],
            "name": cast_row[1],
            "image_url": cast_row[2],
            "role": cast_row[3],
            "character_name": cast_row[4]
        }
        
        if cast_row[3] == "director":
            movie["director"] = cast_row[1]
        
        movie["cast"].append(person)
    
    return movie

@app.get("/people/{person_id}")
def get_person(person_id: int):
    try:
        cursor.execute("""
            SELECT 
                id,
                name,
                birth_date,
                biography,
                image_url
            FROM people 
            WHERE id = ?
        """, (person_id,))
        
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Person not found")
        
        return {
            "id": row[0],
            "name": row[1],
            "birth_date": row[2].isoformat() if row[2] else None,  # Convert date → string
            "biography": row[3],
            "image_url": row[4]
        }
        
    except Exception as e:
        print(f"Error fetching person {person_id}: {e}")
        raise HTTPException(status_code=500, detail="Server error")