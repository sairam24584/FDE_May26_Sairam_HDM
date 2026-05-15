"""
Initialize the HDMS SQLite database.

Usage (from project root):
    python database/init_db.py

Creates `backend/helpdesk.db`, applies `schema.sql`, then loads `seed.sql`.
Safe to re-run — schema.sql drops the table first.
"""

import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "backend" / "helpdesk.db"
SCHEMA_PATH = ROOT / "database" / "schema.sql"
SEED_PATH = ROOT / "database" / "seed.sql"


def init() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    print(f"[init_db] Target DB : {DB_PATH}")

    with sqlite3.connect(DB_PATH) as conn:
        conn.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
        print("[init_db] Schema applied.")
        conn.executescript(SEED_PATH.read_text(encoding="utf-8"))
        print("[init_db] Seed data loaded.")
        count = conn.execute("SELECT COUNT(*) FROM tickets").fetchone()[0]
        print(f"[init_db] Total tickets in DB: {count}")


if __name__ == "__main__":
    init()
