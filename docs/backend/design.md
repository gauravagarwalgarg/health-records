# Backend Design

> **Warning:** This content is AI inspired.

The design focuses on modularity. We use:
- `pdf_extractor`: uses pdfplumber for extracting text.
- `llm_parser`: uses google-genai to parse text into structured JSON.
- `database`: uses sqlite3 to store upload records.
- `models`: Pydantic models for structured output schema.

## Component Interaction
```mermaid
sequenceDiagram
    participant User
    participant Main
    participant Extractor
    participant LLM
    participant DB
    User->>Main: POST /analyze (PDF)
    Main->>Extractor: extract_text()
    Extractor-->>Main: raw text
    Main->>LLM: parse_report(text)
    LLM-->>Main: HealthReport model
    Main->>DB: save_upload()
    DB-->>Main: record_id
    Main-->>User: JSON response
```
