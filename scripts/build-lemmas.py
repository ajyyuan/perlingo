"""Compatibility entry point for the current edited CORPES deck builder."""
import runpy
from pathlib import Path
runpy.run_path(str(Path(__file__).with_name("build-corpes-deck.py")), run_name="__main__")
