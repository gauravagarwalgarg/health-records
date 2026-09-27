"""FastAPI application for Health Records Test Analysis."""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

import database
import pdf_extractor
import llm_parser


@asynccontextmanager
async def lifespan(app: FastAPI):
    database.init_db()
    yield


app = FastAPI(
    title="Health Records Analysis API",
    description="Upload a medical test PDF and get structured analysis powered by Gemini AI.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.post("/analyze")
async def analyze_pdf(file: UploadFile = File(...)):
    """Accept a PDF file, extract text, parse with Gemini, save to DB, return JSON."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    # Save uploaded file to a temp location
    import tempfile, shutil
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        # 1. Extract text
        try:
            raw_text = pdf_extractor.extract_text(tmp_path)
        except ValueError as e:
            raise HTTPException(status_code=422, detail=str(e))

        # 2. Parse with LLM
        try:
            report = llm_parser.parse_report(raw_text)
        except EnvironmentError as e:
            raise HTTPException(status_code=500, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"LLM parsing failed: {e}")

        # 3. Save to DB
        report_dict = report.model_dump()
        record_id = database.save_upload(file.filename, report_dict)

        return {
            "id": record_id,
            "filename": file.filename,
            **report_dict,
        }
    finally:
        os.unlink(tmp_path)


@app.get("/uploads")
async def list_uploads():
    """Return all previous upload records."""
    return database.get_all_uploads()
