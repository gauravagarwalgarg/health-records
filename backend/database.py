"""SQLite database module for logging PDF uploads and analysis results."""
import json
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List

DB_PATH = Path(__file__).parent / "health_records.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Create the uploads table if it does not exist."""
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS uploads (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                filename    TEXT NOT NULL,
                upload_date TEXT NOT NULL,
                json_result TEXT NOT NULL
            )
        """)
        conn.commit()


def save_upload(filename: str, json_result: Dict[str, Any]) -> int:
    """Insert a new upload record and return its ID."""
    with get_connection() as conn:
        cursor = conn.execute(
            "INSERT INTO uploads (filename, upload_date, json_result) VALUES (?, ?, ?)",
            (filename, datetime.utcnow().isoformat(), json.dumps(json_result)),
        )
        conn.commit()
        return cursor.lastrowid


def get_all_uploads() -> List[Dict[str, Any]]:
    """Return all upload records."""
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id, filename, upload_date FROM uploads ORDER BY id DESC"
        ).fetchall()
        return [dict(row) for row in rows]
