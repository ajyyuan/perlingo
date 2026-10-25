"""Build the explicitly edited study deck, preserving unmodified corpus evidence."""
import hashlib
import importlib.util
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data/spanish-lemmas"
OUT = ROOT / "lemmas/data"
spec = importlib.util.spec_from_file_location("selection", ROOT / "scripts/select-corpes-lemmas.py")
selection = importlib.util.module_from_spec(spec)
spec.loader.exec_module(selection)
dictionary = json.loads((DATA / "dictionary-extract.json").read_text())
edits = json.loads((DATA / "teaching-edits.json").read_text())
POS = {"N":"n", "V":"v", "A":"adj", "R":"adv", "T":"art", "C":"conj", "P":"prep",
       "L":"pron", "H":"pron", "W":"pron", "D":"determiner", "X":"determiner", "Q":"determiner", "M":"num"}


def meaning(word, tag):
    for section in dictionary.get(word, "").split("pos: ")[1:]:
        if section.splitlines()[0] not in ({"Q": {"determiner", "pron", "adj", "adv"}, "M": {"num", "adj"}, "D": {"determiner", "pron"}, "X": {"determiner", "pron"}}.get(tag, {POS[tag]})):
            continue
        for match in re.finditer(r"^  gloss: (.+)((?:\n(?!  gloss:|pos:).*)*)", section, re.M):
            gloss = match[1]
            qualifiers = re.findall(r"^    q: (.+)", match[2], re.M)
            if any(re.search(r"\b(archaic|obsolete|dated|rare|uncommon|proscribed)\b", q) for q in qualifiers):
                continue
            if re.search(r"^(obsolete |alternative |archaic |plural |feminine |.* participle )?(form|spelling) of ", gloss):
                continue
            if any(token in gloss for token in ["{{", "<", "[["]):
                continue
            if re.match(r"(?:Senses relating|Figurative senses|alternative case form|female equivalent|abbreviation of)", gloss):
                continue
            # Retain region/register/grammar qualifiers; extraction does not certify all senses.
            return [gloss + (" (" + ", ".join(qualifiers) + ")" if qualifiers else "")]
    return []


def build():
    raw = selection.SOURCE.read_bytes()
    assert hashlib.sha256(raw).hexdigest() == selection.EXPECTED_SHA
    cards, excluded, decisions = [], [], []
    for source_rank, line in enumerate(raw.decode().splitlines()[2:], 1):
        if not line.strip():
            continue
        source_lemma, tag, count, *_ = line.split("\t")
        key = source_lemma + ":" + tag
        reason = selection.exclusion(source_lemma, tag)
        if key == "intereses:N":
            reason = "Plural-specific interests included in interés:N; do not count as another study lemma or sum counts"
        if reason:
            excluded.append(dict(sourceRank=source_rank, lemma=source_lemma, tag=tag, reason=reason))
            continue
        edit = edits.get(key, {})
        word = edit.get("lemma", source_lemma)
        meanings = edit.get("meanings") or meaning(word, tag)
        assert meanings, f"Missing teaching meaning: {key}"
        card = dict(id=f"corpes:{source_lemma}:{tag}", rank=len(cards)+1, lemma=word,
                    sourceLemma=source_lemma, sourceTag=tag, sourceRank=source_rank,
                    count=int(count), partOfSpeech=selection.TAGS[tag], meanings=meanings,
                    forms=edit.get("forms", []), dictionary=f"https://en.wiktionary.org/wiki/{word}#Spanish",
                    editorial=bool(edit), sourceNote=edit.get("sourceNote", ""))
        cards.append(card)
        if edit:
            decisions.append(dict(id=card["id"], sourceRank=source_rank, **edit))
        if len(cards) == 1500:
            break
    assert len(cards) == 1500 and len({c["id"] for c in cards}) == 1500
    assert len({(c["lemma"], c["sourceTag"]) for c in cards}) == 1500
    assert cards[-1]["lemma"] == "religioso"
    manifest = dict(
        title="Edited CORPES study deck", version=2, accessed="2026-10-25",
        source="RAE / ASALE, CORPES XXI: 5000 lemas",
        sourceUrl="https://www.rae.es/corpes/assets/rae/files/corpes/5000_lemas.html",
        sourceVersion="Not stated on the downloadable table", sourceSha256=selection.EXPECTED_SHA,
        dictionarySource="English Wiktionary contributors, via Jeff Doozan spanish_data",
        dictionaryRevision="b8ed076b4faea26a0985ee46ca736771c2e62dc4",
        dictionaryOriginalSha256="7cb53827e68a6d8fabcc40c3072adf25c6279500d116bafd3c4a7aad70a0347f",
        dictionaryExtractSha256=hashlib.sha256((DATA / "dictionary-extract.json").read_bytes()).hexdigest(),
        teachingEditsSha256=hashlib.sha256((DATA / "teaching-edits.json").read_bytes()).hexdigest(),
        count=len(cards), distinctSpellings=len({c["lemma"] for c in cards}),
        dataLicense="CC BY-SA 4.0; retain RAE/ASALE and Wiktionary/Jeff Doozan attribution",
        counting="One card per selected lemma/POS; interests folded into interés, without adding counts; backfilled religioso",
        decisions=decisions, exclusions=excluded,
        limitations=["Edited study selection, not an exact top 1500 lexical frequency inventory",
                     "Counts belong to original source entries, not necessarily the displayed headword/sense",
                     "No measured 90% coverage, retention or comprehension claim",
                     "Automatic dictionary extraction with scoped editorial review, not independent linguistic certification"],
    )
    (OUT / "deck.json").write_text(json.dumps(cards, ensure_ascii=False, indent=2)+"\n")
    (OUT / "provenance.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+"\n")
    # Public download preserves the complete source evidence used by this deck.
    (OUT / "corpes-5000-source.tsv").write_bytes(raw)
    print(f"Built {len(cards)} cards; {manifest['distinctSpellings']} spellings; {len(decisions)} editorial entries.")


if __name__ == "__main__":
    build()
