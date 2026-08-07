from fastapi import FastAPI
from app.database import engine

app = FastAPI()

@app.get("/")

def home():
    with engine.connect() as conn:
        return {"message": "Connected to Neon Postgresql"}