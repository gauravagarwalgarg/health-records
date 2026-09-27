"""LLM parsing module using Gemini API to extract structured health report data."""
import json
import os

from google import genai
from google.genai import types

from models import HealthReport

MODEL = "gemini-3.7-flash"

SYSTEM_PROMPT = """You are a medical data extraction expert. You will be given raw text from a medical lab report PDF.
Your task is to extract all biomarker data and return it as structured JSON.

Instructions:
- Extract EVERY biomarker/test result mentioned in the report.
- For each marker, extract: name, patient_value (numeric), reference range (min and max), unit, and whether it is Normal/High/Low.
- If a marker is flagged as H (High) or L (Low) in the report, set status accordingly. Otherwise compare patient_value to the range.
- Provide an overall_analysis: a 2-3 sentence clinical summary of the patient's results.
- Provide suggested_fixes: specific, actionable advice ONLY for each out-of-bound marker (lifestyle, diet, follow-up).
- If no markers are out of bound, provide at least two general wellness recommendations.
- Return ONLY valid JSON matching the required schema. No markdown, no explanations.
"""


def parse_report(raw_text: str) -> HealthReport:
    """Use Gemini API to extract structured health data from raw PDF text.

    Args:
        raw_text: Raw text extracted from a medical PDF.

    Returns:
        A validated HealthReport Pydantic object.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise EnvironmentError("GEMINI_API_KEY environment variable is not set.")

    client = genai.Client(api_key=api_key)

    response = client.models.generate_content(
        model=MODEL,
        contents=f"Here is the medical lab report text:\n\n{raw_text}",
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
            response_json_schema=HealthReport.model_json_schema(),
            temperature=0.1,
        ),
    )

    data = json.loads(response.text)
    return HealthReport(**data)
