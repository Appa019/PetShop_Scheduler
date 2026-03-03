"""
Ponto de entrada da API 8Patas (FastAPI).
Configura CORS, cria as tabelas do banco e registra os routers.
APScheduler envia lembretes de consulta todo dia às 08:00 (horário de Brasília).
"""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import models
from database import engine
from routers import auth, pets, appointments
from scheduler import scheduler, send_daily_reminders

load_dotenv()

models.Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: registra e inicia o scheduler
    scheduler.add_job(
        send_daily_reminders,
        "cron",
        hour=8,
        minute=0,
        id="daily_reminders",
        replace_existing=True,
    )
    scheduler.start()
    print("[scheduler] APScheduler iniciado — lembretes às 08:00 diariamente.")
    yield
    # Shutdown
    scheduler.shutdown(wait=False)
    print("[scheduler] APScheduler encerrado.")


app = FastAPI(title="8Patas Veterinary API", lifespan=lifespan)

_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
allowed_origins = [o.strip() for o in _raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    """Health check básico."""
    return {"message": "Welcome to 8Patas API"}


app.include_router(auth.router)
app.include_router(pets.router)
app.include_router(appointments.router)
