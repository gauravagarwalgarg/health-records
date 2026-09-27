# Backend Requirements

> **Warning:** This content is AI inspired.

## Functional Requirements
- Expose a `POST /analyze` endpoint that accepts a PDF file.
- Use `pdfplumber` to extract text.
- Use Gemini API with structured JSON output capabilities.
- Persist analysis results into an SQLite database.
- Provide a `GET /uploads` endpoint to list past records.
