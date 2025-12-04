from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import mariadb
import os
import sys

load_dotenv()

def get_db_connection():
    try:
        return mariadb.connect(
            user=os.getenv("MARIADB_USER"),
            password=os.getenv("MARIADB_PASSWORD"),
            host=os.getenv("MARIADB_HOST"),
            port=int(os.getenv("MARIADB_PORT")),
            database=os.getenv("MARIADB_DATABASE")
        )
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB: {e}")
        raise HTTPException(500, "Database connection failed")

def get_cursor():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        yield cursor
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "PUT"],
    allow_headers=["*"],
)

app.add_middleware(SessionMiddleware, secret_key=os.getenv("SESSION_SECRET", "super-secret-123"))

def get_current_user(request: Request):
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Not logged in")
    return user_id

@app.post("/register")
def register(username: str = Form(...), password: str = Form(...), cursor = Depends(get_cursor)):
    try:
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        return {"message": "User created"}
    except mariadb.IntegrityError:
        raise HTTPException(400, "Username already exists")

@app.post("/login")
def login(request: Request, username: str = Form(...), password: str = Form(...), cursor = Depends(get_cursor)):
    cursor.execute("SELECT id FROM users WHERE username = ? AND password = ?", (username, password))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(401, "Wrong username or password")
    request.session["user_id"] = user[0]
    return {"message": "Logged in"}

@app.post("/logout")
def logout(request: Request):
    request.session.clear()
    return {"message": "Logged out"}

@app.post("/favorites/{movie_id}")
def add_favorite(movie_id: int, user_id: int = Depends(get_current_user), cursor = Depends(get_cursor)):
    try:
        cursor.execute("INSERT INTO favorites (user_id, movie_id) VALUES (?, ?)", (user_id, movie_id))
        return {"message": "Added"}
    except mariadb.IntegrityError:
        raise HTTPException(400, "Already in favorites")

@app.delete("/favorites/{movie_id}")
def remove_favorite(movie_id: int, user_id: int = Depends(get_current_user), cursor = Depends(get_cursor)):
    cursor.execute("DELETE FROM favorites WHERE user_id = ? AND movie_id = ?", (user_id, movie_id))
    return {"message": "Removed"}

@app.get("/favorites")
def get_favorites(user_id: int = Depends(get_current_user), cursor = Depends(get_cursor)):
    cursor.execute("""
        SELECT m.id, m.title, m.plot, m.release_date, m.runtime, m.rating, m.genre, m.image_url
        FROM favorites f
        JOIN movies m ON f.movie_id = m.id
        WHERE f.user_id = ?
    """, (user_id,))
    return [{"id": r[0], "title": r[1], "plot": r[2], "release_date": r[3],
             "runtime": r[4], "rating": r[5], "genre": r[6], "image_url": r[7]}
            for r in cursor.fetchall()]

@app.get("/movies")
def get_movies(cursor = Depends(get_cursor)):
    cursor.execute("SELECT id, title, plot, release_date, runtime, rating, genre, image_url FROM movies")
    return [{"id": r[0], "title": r[1], "plot": r[2], "release_date": r[3],
             "runtime": r[4], "rating": r[5], "genre": r[6], "image_url": r[7]}
            for r in cursor.fetchall()]

@app.get("/movies/{movie_id}")
def get_movie(movie_id: int, cursor = Depends(get_cursor)):
    cursor.execute("SELECT id, title, plot, release_date, runtime, rating, genre, image_url FROM movies WHERE id = ?", (movie_id,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(404, "Movie not found")
    movie = {"id": row[0], "title": row[1], "plot": row[2], "release_date": row[3],
             "runtime": row[4], "rating": row[5], "genre": row[6], "image_url": row[7],
             "director": None, "cast": []}
    cursor.execute("""SELECT p.id, p.name, p.image_url, mp.role, mp.character_name
                      FROM movie_people mp JOIN people p ON mp.person_id = p.id
                      WHERE mp.movie_id = ?""", (movie_id,))
    for r in cursor.fetchall():
        person = {"person_id": r[0], "name": r[1], "image_url": r[2], "role": r[3], "character_name": r[4]}
        if r[3] == "director":
            movie["director"] = r[1]
        movie["cast"].append(person)
    return movie

@app.get("/people/{person_id}")
def get_person(person_id: int, cursor = Depends(get_cursor)):
    cursor.execute("SELECT id, name, birth_date, biography, image_url FROM people WHERE id = ?", (person_id,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(404, "Person not found")
    return {"id": row[0], "name": row[1],
            "birth_date": row[2].isoformat() if row[2] else None,
            "biography": row[3], "image_url": row[4]}

@app.post("/movies/{movie_id}/comments")
def add_comment(movie_id: int, content: str = Form(...), user_id: int = Depends(get_current_user), cursor = Depends(get_cursor)):
    cursor.execute(
        "INSERT INTO comments (movie_id, user_id, content) VALUES (?, ?, ?)",
        (movie_id, user_id, content)
    )
    return {"message": "Comment added"}

@app.get("/movies/{movie_id}/comments")
def get_comments(movie_id: int, cursor = Depends(get_cursor)):
    cursor.execute("""
        SELECT c.id, c.content, c.created_at, c.edited_at, u.username, u.id as user_id
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.movie_id = ?
        ORDER BY c.created_at DESC
    """, (movie_id,))
    
    return [{"id": r[0], "content": r[1], "created_at": r[2].isoformat() if r[2] else None, "edited_at": r[3].isoformat() if r[3] else None, "username": r[4], "user_id": r[5]}
            for r in cursor.fetchall()]

@app.post("/movies/{movie_id}/comments/{comment_id}")
def update_comment(movie_id: int, comment_id: int, content: str = Form(...), user_id: int = Depends(get_current_user), cursor = Depends(get_cursor)):
    cursor.execute(
        "UPDATE comments SET content = ?, edited_at = NOW() WHERE id = ? AND movie_id = ? AND user_id = ?",
        (content, comment_id, movie_id, user_id)
    )
    if cursor.rowcount == 0:
        raise HTTPException(404, "Comment not found or not yours")
    return {"message": "Comment updated"}

@app.delete("/movies/{movie_id}/comments/{comment_id}")
def delete_comment(movie_id: int, comment_id: int, user_id: int = Depends(get_current_user), cursor = Depends(get_cursor)):
    cursor.execute(
        "DELETE FROM comments WHERE movie_id = ? AND id = ? AND user_id = ?",
        (movie_id, comment_id, user_id)
    )
    if cursor.rowcount == 0:
        raise HTTPException(404, "Comment not found or not yours")
    return {"message": "Comment deleted"}

@app.get("/me")
def get_me(user_id: int = Depends(get_current_user), cursor = Depends(get_cursor)):
    cursor.execute("SELECT id, username FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(404, "User not found")
    return {"id": row[0], "username": row[1]}