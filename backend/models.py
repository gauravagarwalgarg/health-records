"""Pydantic models defining the strict schema for health report JSON."""
from enum import Enum
from typing import List
from pydantic import BaseModel, Field


class MarkerStatus(str, Enum):
    NORMAL = "Normal"
    HIGH = "High"
    LOW = "Low"


class Marker(BaseModel):
    name: str = Field(description="Name of the biomarker, e.g. 'Hemoglobin'")
    patient_value: float = Field(description="The patient's measured value")
    min_range: float = Field(description="Lower bound of the normal reference range")
    max_range: float = Field(description="Upper bound of the normal reference range")
    unit: str = Field(description="Unit of measurement, e.g. 'g/dL'")
    status: MarkerStatus = Field(description="Whether the value is Normal, High, or Low")


class HealthReport(BaseModel):
    test_type: str = Field(description="Type of medical test, e.g. 'Complete Blood Count'")
    markers: List[Marker] = Field(description="List of all biomarkers extracted from the report")
    overall_analysis: str = Field(description="A brief overall clinical summary of the patient's results")
    suggested_fixes: List[str] = Field(description="Actionable lifestyle, dietary, or medical advice for out-of-bound markers")
