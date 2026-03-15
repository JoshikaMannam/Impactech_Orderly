from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from routes import auth, menu, orders, voice, staff

load_dotenv()

app = FastAPI(
    title="Orderly API",
    description="AI-powered voice order management for restaurants",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        os.getenv("FRONTEND_URL", "http://localhost:5173"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,   prefix="/auth",   tags=["Auth"])
app.include_router(menu.router,   prefix="/menu",   tags=["Menu"])
app.include_router(orders.router, prefix="/order",  tags=["Orders"])
app.include_router(voice.router,  prefix="/voice",  tags=["Voice"])
app.include_router(staff.router,  prefix="/staff",  tags=["Staff"])

@app.get("/", tags=["Health"])
def root():
    return {"status": "Orderly API is running", "version": "1.0.0"}

@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}