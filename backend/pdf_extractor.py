"""PDF text extraction using pdfplumber."""
import pdfplumber


def extract_text(pdf_path: str) -> str:
    """Extract all text from a PDF file.

    Args:
        pdf_path: Path to the PDF file.

    Returns:
        Concatenated text from all pages.

    Raises:
        ValueError: If the PDF contains no extractable text.
    """
    parts = []
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages, start=1):
            text = page.extract_text()
            if text:
                parts.append(f"--- Page {i} ---\n{text}")

    if not parts:
        raise ValueError(f"No extractable text found in '{pdf_path}'.")

    return "\n\n".join(parts)
