from fastapi import FastAPI

from app.auth.auth_router import router as auth_router

from app.routers.user_router import router as user_router

from app.routers.donation_router import router as donation_router

from app.routers.donation_image import router as donation_image_router

from app.routers.ai import router as ai_router

from app.routers.verification_router import router as verification_router

from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="FoodRescue AI"
)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

app.include_router(auth_router)

app.include_router(user_router)

app.include_router(donation_router)

app.include_router(verification_router)

app.include_router(
    donation_image_router
)

app.include_router(
    ai_router
)

@app.get("/")

def home():
    
        return {"message": "backend RUnning"}