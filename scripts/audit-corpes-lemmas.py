"""Report dictionary/category mismatches; never silently repair source counts."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data/spanish-lemmas"
rows = json.loads((DATA / "corpes-1500.json").read_text())
dictionary = json.loads((DATA / "dictionary-extract.json").read_text())
mapping = {
    "N": {"n"}, "V": {"v"}, "A": {"adj"}, "R": {"adv"}, "T": {"art"},
    "C": {"conj"}, "P": {"prep"}, "L": {"pron"}, "H": {"pron", "determiner"},
    "W": {"pron", "determiner", "adv"}, "D": {"determiner", "pron"},
    "X": {"determiner", "pron"}, "Q": {"determiner", "pron", "adj", "adv"},
    "M": {"num", "adj"},
}
issues = []
for row in rows:
    categories = sorted(set(re.findall(r"^pos: (.+)", dictionary.get(row["lemma"], ""), re.M)))
    if not set(categories) & mapping.get(row["tag"], set()):
        issues.append(dict(rank=row["rank"], sourceRank=row["sourceRank"],
                           lemma=row["lemma"], sourceTag=row["tag"], dictionaryCategories=categories,
                           status="Needs review; a cross-dictionary mismatch is not proof of a corpus error"))
result = dict(entriesChecked=len(rows), categoryMismatches=issues,
              limitation="Checks available dictionary categories only; does not establish sense equivalence or validate corpus token assignments.")
(DATA / "dictionary-audit.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
assert any(r["lemma"] == "intereses" for r in issues)
assert any(r["lemma"] == "característico" for r in issues)
print(f"Audited {len(rows)} entries; {len(issues)} category mismatches require review.")
