"""
Database connection module.

Uses SQLAlchemy 2.x with a local SQLite file (`helpdesk.db`).
Switching to PostgreSQL later is a one-line change: replace the URL.
"""

from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# Resolve DB path relative to this file so the API runs regardless of cwd.
DB_FILE = Path(__file__).resolve().parent / "helpdesk.db"
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_FILE}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},  # required for SQLite + FastAPI
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """SQLAlchemy 2.x declarative base for all ORM models."""


def get_db():
    """FastAPI dependency that yields a DB session and ensures it's closed."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
