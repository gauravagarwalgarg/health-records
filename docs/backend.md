# Backend Documentation

> **Warning:** This content is AI inspired.

The backend is a FastAPI application that handles:
- File uploads (PDF format).
- Extracting text using `pdf_extractor`.
- Parsing medical data via `llm_parser` (Gemini API).
- Storing records in a database (`database.py`).

## API Endpoints

- `GET /health` - Health check.
- `POST /analyze` - Uploads a PDF and returns the extracted, structured data.
- `GET /uploads` - Retrieves all previously uploaded records.
