# Backend Architecture

> **Warning:** This content is AI inspired.

The backend uses FastAPI and sqlite.

## System Architecture
```mermaid
graph TD
    Client(Client) --> FastAPI(FastAPI App)
    FastAPI --> PDFExtractor(PDF Extractor)
    FastAPI --> LLMParser(LLM Parser)
    LLMParser --> GeminiAPI(Gemini API)
    FastAPI --> Database(SQLite DB)
```
