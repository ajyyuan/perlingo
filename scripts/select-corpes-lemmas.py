"""Select an auditable single-word lemma/POS list; no UI or gloss generation."""
import hashlib
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data/spanish-lemmas"
SOURCE = OUT / "corpes-5000-source.tsv"
EXPECTED_SHA = "bdbf8452fc8a1b6b18e06b5e5ef6cbf6a75db9b89017dbd2e57c30fc483555de"
TAGS = dict(A="adjective", R="adverb", J="affix", T="article", C="conjunction",
            E="contraction", Q="quantifier", D="demonstrative", U="unknown",
            F="foreign word", I="interjection", W="interrogative", M="numeral",
            X="possessive", P="preposition", L="personal pronoun", Y="punctuation",
            H="relative", N="noun", V="verb")


def exclusion(lemma, tag):
    if tag in {"Y", "U", "J"}:
        return "punctuation, unknown token, or affix"
    if not lemma.islower() and any(c.isupper() for c in lemma):
        return "capitalized entry (name/abbreviation heuristic)"
    if any(c.isspace() for c in lemma):
        return "multiword expression"
    if not lemma.isalpha():
        return "numeric or nonalphabetic entry"
    if lemma in {"al", "del"}:
        return "contraction; teach with a/de + el"
    if len(lemma) == 1 and (lemma, tag) not in {("a", "P"), ("y", "C"), ("o", "C")}:
        return "letter name or single-letter entry"
    return None


def build():
    raw = SOURCE.read_bytes()
    assert hashlib.sha256(raw).hexdigest() == EXPECTED_SHA, "Source changed; review provenance first"
    # The source is literal tab-separated PRE text, not quoted CSV (one row is a quote).
    records = [line.split("\t") for line in raw.decode().splitlines()[2:] if line.strip()]
    assert len(records) == 5000 and all(len(row) == 5 for row in records)
    counts = [int(row[2]) for row in records]
    assert all(a >= b for a, b in zip(counts, counts[1:]))
    assert len({(r[0], r[1]) for r in records}) == 5000
    selected, excluded = [], []
    for source_rank, (lemma, tag, count, norm_with, norm_without) in enumerate(records, 1):
        entry = dict(sourceRank=source_rank, lemma=lemma, tag=tag, pos=TAGS[tag],
                     count=int(count), frequencyPerMillionWithPunctuation=float(norm_with),
                     frequencyPerMillionWithoutPunctuation=float(norm_without))
        reason = exclusion(lemma, tag)
        if reason:
            excluded.append(dict(entry, reason=reason))
        else:
            selected.append(dict(rank=len(selected) + 1, **entry))
        if len(selected) == 1500:
            break
    assert len(selected) == 1500
    keys = {(r["lemma"], r["tag"]) for r in selected}
    assert {("no", "R"), ("ser", "V"), ("estar", "V"), ("haber", "V"),
            ("que", "H"), ("que", "C"), ("poder", "V"), ("poder", "N")} <= keys
    assert not any(r["lemma"] in {"al", "del", "b", "España", "1"} for r in selected)
    spellings = Counter(r["lemma"] for r in selected)
    manifest = dict(
        source="Real Academia Española / ASALE, CORPES XXI: 5000 lemas",
        sourceUrl="https://www.rae.es/corpes/assets/rae/files/corpes/5000_lemas.html",
        retrieved="2026-10-25", sourceSha256=EXPECTED_SHA,
        snapshot="Browser DOM PRE text, preserved as UTF-8; not raw HTML or ZIP bytes",
        sourceVersion="Not stated on the table; do not infer from the current corpus homepage",
        license="CC BY-SA 4.0", licenseUrl="https://creativecommons.org/licenses/by-sa/4.0/",
        modifications="Filtered rows and added ranks, English POS labels, and exclusion reasons. No counts or lemmas changed.",
        selectionUnit="source lemma + POS; no merging across POS or spelling variants",
        selectedEntries=len(selected), distinctSpellings=len(spellings),
        lastSourceRank=selected[-1]["sourceRank"], exclusionsBeforeCutoff=len(excluded),
        exclusionCounts=dict(Counter(r["reason"] for r in excluded)),
        repeatedSpellings={w: n for w, n in spellings.items() if n > 1},
        limitations=["Corpus-specific ranking, not a universal top 1500 or a conversational coverage estimate",
                     "Automatic annotation can contain errors; not a manual linguistic certification",
                     "Capitalization is a name filter, not a complete proper-noun annotation",
                     "No translations or inflection inventory have been validated for this selection"],
    )
    for name, value in [("corpes-1500.json", selected), ("exclusions.json", excluded), ("provenance.json", manifest)]:
        (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
    lines = ["Rank\tLemma\tPart of speech\tSource row\tCount"]
    lines += [f'{r["rank"]}\t{r["lemma"]}\t{r["pos"]}\t{r["sourceRank"]}\t{r["count"]}' for r in selected]
    (OUT / "corpes-1500.txt").write_text("\n".join(lines) + "\n")
    print(json.dumps({k: manifest[k] for k in ("selectedEntries", "distinctSpellings", "lastSourceRank", "exclusionCounts")}, indent=2))


if __name__ == "__main__":
    build()
