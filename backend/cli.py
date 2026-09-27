#!/usr/bin/env python3
"""CLI entry point for Health Records Test Analysis."""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import database
import pdf_extractor
import llm_parser

try:
    from rich.console import Console
    from rich.panel import Panel
    from rich.table import Table
    from rich import box
    HAS_RICH = True
except ImportError:
    HAS_RICH = False


def main():
    parser = argparse.ArgumentParser(
        prog="cli.py",
        description="Health Records Test Analysis CLI",
    )
    sub = parser.add_subparsers(dest="command")

    analyze_cmd = sub.add_parser("analyze", help="Analyze a lab report PDF")
    analyze_cmd.add_argument("pdf_path", help="Path to the PDF lab report")
    analyze_cmd.add_argument(
        "--json", dest="output_json", action="store_true", help="Output raw JSON"
    )

    args = parser.parse_args()

    if args.command == "analyze":
        run_analyze(args.pdf_path, args.output_json)
    else:
        parser.print_help()


def run_analyze(pdf_path: str, output_json: bool = False):
    console = Console() if HAS_RICH else None

    path = Path(pdf_path)
    if not path.exists():
        print(f"Error: File not found: {pdf_path}")
        sys.exit(1)

    database.init_db()

    _print(console, f"[cyan]Extracting text from:[/cyan] {path.name}", f"Extracting text from: {path.name}")

    try:
        raw_text = pdf_extractor.extract_text(str(path))
    except ValueError as e:
        print(f"Extraction failed: {e}")
        sys.exit(1)

    _print(console, "[cyan]Sending to Gemini AI for analysis...[/cyan]", "Sending to Gemini AI for analysis...")

    try:
        report = llm_parser.parse_report(raw_text)
    except Exception as e:
        print(f"LLM parsing failed: {e}")
        sys.exit(1)

    database.save_upload(path.name, report.model_dump())

    if output_json:
        print(json.dumps(report.model_dump(), indent=2))
        return

    if console:
        console.print()
        console.print(Panel(
            f"[bold yellow]{report.test_type}[/bold yellow]\n\n{report.overall_analysis}",
            title="[bold green]Health Report Analysis[/bold green]",
            border_style="green",
        ))

        table = Table(box=box.ROUNDED, show_header=True, header_style="bold magenta")
        table.add_column("Biomarker", style="cyan", min_width=25)
        table.add_column("Value", justify="right")
        table.add_column("Unit", justify="center")
        table.add_column("Normal Range", justify="center")
        table.add_column("Status", justify="center")

        for m in report.markers:
            if m.status.value == "Normal":
                icon = "[green]✓ Normal[/green]"
            elif m.status.value == "High":
                icon = "[red]↑ High[/red]"
            else:
                icon = "[yellow]↓ Low[/yellow]"
            table.add_row(
                m.name,
                str(m.patient_value),
                m.unit,
                f"{m.min_range} - {m.max_range}",
                icon,
            )

        console.print(table)

        if report.suggested_fixes:
            console.print()
            console.print(Panel(
                "\n".join(f"  {i+1}. {fix}" for i, fix in enumerate(report.suggested_fixes)),
                title="[bold red]Recommended Actions[/bold red]",
                border_style="red",
            ))

        console.print("\n[green]Analysis complete. Results saved to local database.[/green]")
    else:
        print(f"\nTest Type: {report.test_type}")
        print(f"Overall: {report.overall_analysis}")
        print("\nMarkers:")
        for m in report.markers:
            print(f"  {m.name}: {m.patient_value} {m.unit} [{m.min_range}-{m.max_range}] - {m.status.value}")
        if report.suggested_fixes:
            print("\nRecommended Actions:")
            for i, fix in enumerate(report.suggested_fixes, 1):
                print(f"  {i}. {fix}")


def _print(console, rich_msg, plain_msg):
    if console:
        console.print(rich_msg)
    else:
        print(plain_msg)


if __name__ == "__main__":
    main()
