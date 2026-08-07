from fastapi import FastAPI

from app.auth.auth_router import router as auth_router

app = FastAPI(
    title="FoodRescue AI"
)

app.include_router(auth_router)

@app.get("/")

def home():
    
        return {"message": "backend RUnning"}