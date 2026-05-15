"""
HDMS — FastAPI application entry point.

Run locally:
    cd backend
    uvicorn main:app --reload --port 8000

Interactive docs at  http://localhost:8000/docs
ReDoc at             http://localhost:8000/redoc
"""

import logging

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from database import Base, engine
from routers import tickets

# ---------- Logging ----------
logging.basicConfig(
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    level=logging.INFO,
)
log = logging.getLogger("hdms")

# ---------- App ----------
app = FastAPI(
    title="Helpdesk Ticket Management System (HDMS) API",
    description=(
        "Phase 1 REST API for creating, viewing, updating, deleting, "
        "and searching internal helpdesk tickets."
    ),
    version="1.0.0",
)

# Auto-create tables on first boot (idempotent — good for the seeded DB too).
Base.metadata.create_all(bind=engine)

# ---------- CORS ----------
# In Phase 1 we allow the local React dev server. For production you'd lock this down.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default
        "http://localhost:3000",  # CRA default (just in case)
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Routes ----------
app.include_router(tickets.router)


@app.get("/", tags=["meta"])
def root():
    return {
        "service": "HDMS API",
        "version": app.version,
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok"}


# ---------- Centralized exception handlers ----------

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    log.warning("Validation error on %s: %s", request.url.path, exc.errors())
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Validation failed", "errors": exc.errors()},
    )


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    log.exception("DB error on %s", request.url.path)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "A database error occurred."},
    )
