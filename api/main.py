from fastapi import FastAPI

app = FastAPI()

@app.get("/actor/{actor_id}/movies")
def read_actor_movies(actor_id: int):
    return {"actor_id": actor_id}
