from fastapi import FastAPI

from app.auth.auth_router import router as auth_router

from app.routers.user_router import router as user_router

from app.routers.donation_router import router as donation_router

app = FastAPI(
    title="FoodRescue AI"
)

app.include_router(auth_router)

app.include_router(user_router)

app.include_router(donation_router)

@app.get("/")

def home():
    
        return {"message": "backend RUnning"}