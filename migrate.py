# /// script
# requires-python = ">=3.10"
# dependencies = ["python-frontmatter", "tomli"]
# ///

import html
import re
import shutil
import sys
try:
    import tomllib
except ImportError:
    import tomli as tomllib  # type: ignore
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path

import frontmatter

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SRC = Path("~/src/test/content/posts").expanduser()
DST = Path("~/src/total-token-vortex/content/posts").expanduser()

SKIP_STEMS = {"_index", "first-post"}  # first-post is a Blowfish demo artifact

RENAMES: dict[str, str] = {
    "alternatives-to-aglorithmic-sty": "alternatives-to-algorithmic-sty",
    "til-abotu-anna-s-archive":        "til-about-anna-s-archive",
    "ian-39-s-shoelace-site":          "ians-shoelace-site",
}

TAG_RULES: dict[str, list[str]] = {
    "linux":        ["ubuntu", "apt", "gnome", "linux", "bash"],
    "keyboard":     ["capslock", "keybinding", "shortcut"],
    "photography":  ["dslr", "camera", "canon", "nikon", "photo"],
    "productivity": ["gtd", "getting things done", "productivity", "pomodoro"],
    "programming":  ["git", "github", "python", "code", "programming", "algorithm"],
    "hardware":     ["printer", "laserjet", "phone", "device", "firmware",
                     "netbook", "acer", "sony", "hp"],
    "hugo":         ["hugo", "blowfish"],
    "blogging":     ["blog", "wordpress", "migrating"],
    "fountain-pen": ["fountain pen", "ink", "nib"],
    "web":          ["browser", "url", "web", "internet", "online"],
    "ai":           ["llm", "gpt", "claude", "ai", "machine learning"],
}

KNOWN_ISSUES: dict[str, str] = {
    "post-438583127379641090":
        "Empty title and empty body — strong candidate for deletion.",
    "post-1508366904087189637":
        "Missing title and truncated content (ends mid-sentence) — strong candidate for deletion.",
    "build-systems-not-goals":
        "Body is just 'TODO' — no content has been written yet.",
    "how-life-is-like-the-westworld-maze":
        "Body is just 'TODO' — no content has been written yet.",
    "installing-win2k-without-key":
        "Contains instructions for bypassing software license validation — review for current relevance/legality.",
}


# ---------------------------------------------------------------------------
# Data
# ---------------------------------------------------------------------------

@dataclass
class MigrationResult:
    src_stem: str
    dst_stem: str
    was_renamed: bool
    tags_added: list[str]
    flagged: bool
    problems: list[str] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def discover_posts(src: Path):
    """Yield (path, is_bundle) for each post to migrate."""
    for entry in sorted(src.iterdir()):
        stem = entry.stem if entry.is_file() else entry.name
        if stem in SKIP_STEMS:
            continue
        if entry.is_dir():
            index = entry / "index.md"
            if index.exists():
                yield (entry, True)
        elif entry.suffix == ".md":
            yield (entry, False)


def read_source(path: Path) -> tuple[dict, str, bool]:
    """Return (front_matter_dict, body, was_toml)."""
    raw = path.read_text(encoding="utf-8")
    if raw.lstrip().startswith("+++"):
        # TOML front matter: slice between the two +++ delimiters
        inner = raw.lstrip()[3:]
        end = inner.find("+++")
        fm_str = inner[:end]
        body = inner[end + 3:].lstrip("\n")
        fm_dict = tomllib.loads(fm_str)
        return fm_dict, body, True
    else:
        post = frontmatter.loads(raw)
        return dict(post.metadata), post.content, False


def resolve_output_filename(stem: str) -> tuple[str, str | None]:
    """Return (new_stem, rename_note_or_None)."""
    if stem in RENAMES:
        new = RENAMES[stem]
        return new, f"Filename renamed from `{stem}` to `{new}` (typo/encoding fix)."
    return stem, None


def assign_tags(stem: str, title: str, body: str, existing: list[str]) -> list[str]:
    combined = (stem + " " + title + " " + body).lower()
    tags = set(existing)

    for tag, keywords in TAG_RULES.items():
        if any(kw in combined for kw in keywords):
            tags.add(tag)

    # Special: `links` tag for very short posts (≤ 3 non-empty lines)
    non_empty = [l for l in body.splitlines() if l.strip()]
    if len(non_empty) <= 3:
        tags.add("links")

    return sorted(tags)


def detect_problems(
    fm: dict,
    body: str,
    was_toml: bool,
    stem: str,
    rename_note: str | None,
) -> list[str]:
    problems: list[str] = []

    if was_toml:
        problems.append("Front matter was TOML; converted to YAML.")

    title = str(fm.get("title") or "").strip()
    if not title:
        problems.append("Empty or missing title.")

    body_stripped = body.strip()
    if not body_stripped:
        problems.append("Body is empty.")
    elif body_stripped.upper() == "TODO":
        problems.append("Body is just 'TODO' — placeholder content only.")

    if rename_note:
        problems.append(rename_note)

    if re.fullmatch(r"post-\d+", stem):
        problems.append(
            "Filename is a numeric post ID (likely a Blogger import artifact)."
        )

    # Broken markdown table: any pipe-containing line over 200 chars
    for line in body.splitlines():
        if "|" in line and len(line) > 200:
            problems.append(
                "Possible broken/collapsed markdown table (very long pipe-delimited line detected)."
            )
            break

    # Future date check
    raw_date = fm.get("date")
    if raw_date:
        try:
            if isinstance(raw_date, str):
                # strip timezone for simple comparison
                dt = datetime.fromisoformat(raw_date.replace("Z", "+00:00"))
            else:
                dt = raw_date  # already a datetime
            now = datetime.now(timezone.utc)
            if dt.tzinfo:
                if dt > now:
                    problems.append(f"Post has a future date ({raw_date}) — verify if intentional.")
            else:
                if dt > datetime.now():
                    problems.append(f"Post has a future date ({raw_date}) — verify if intentional.")
        except Exception:
            pass

    # Hardcoded known issues
    if stem in KNOWN_ISSUES:
        problems.append(KNOWN_ISSUES[stem])

    return problems


def build_note_block(problems: list[str]) -> str | None:
    if not problems:
        return None
    joined = " ".join(problems)
    return f"\n\n---\n\n> **Claude (migration note):** _{joined}_\n"


def write_output(
    dst_path: Path,
    fm: dict,
    body: str,
    note_block: str | None,
    force: bool,
) -> bool:
    """Write post to dst_path. Returns True if written, False if skipped."""
    if dst_path.exists() and not force:
        return False
    full_body = body + (note_block or "")
    post = frontmatter.Post(full_body, **fm)
    dst_path.parent.mkdir(parents=True, exist_ok=True)
    dst_path.write_text(frontmatter.dumps(post) + "\n", encoding="utf-8")
    return True


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    force = "--force" in sys.argv
    DST.mkdir(parents=True, exist_ok=True)

    results: list[MigrationResult] = []
    skipped_existing: list[str] = []

    for src_path, is_bundle in discover_posts(SRC):
        if is_bundle:
            # Bundle directory: process index.md, copy assets
            index_src = src_path / "index.md"
            fm, body, was_toml = read_source(index_src)
            stem = src_path.name
        else:
            fm, body, was_toml = read_source(src_path)
            stem = src_path.stem

        dst_stem, rename_note = resolve_output_filename(stem)

        # Unescape HTML entities in title
        if "title" in fm and fm["title"]:
            fm["title"] = html.unescape(str(fm["title"]))

        problems = detect_problems(fm, body, was_toml, stem, rename_note)

        new_tags = assign_tags(dst_stem, str(fm.get("title") or ""), body, [])
        fm["tags"] = new_tags

        if problems:
            existing_tags = fm.get("tags") or []
            if "review" not in existing_tags:
                fm["tags"] = sorted(set(new_tags) | {"review"})

        note_block = build_note_block(problems)

        if is_bundle:
            dst_dir = DST / dst_stem
            dst_path = dst_dir / "index.md"
        else:
            dst_path = DST / f"{dst_stem}.md"

        written = write_output(dst_path, fm, body, note_block, force)

        if not written:
            skipped_existing.append(dst_stem)
            continue

        # Copy bundle assets (non-.md files)
        if is_bundle:
            for asset in src_path.iterdir():
                if asset.suffix != ".md":
                    shutil.copy2(asset, dst_dir / asset.name)

        results.append(MigrationResult(
            src_stem=stem,
            dst_stem=dst_stem,
            was_renamed=(rename_note is not None),
            tags_added=new_tags,
            flagged=bool(problems),
            problems=problems,
        ))

    # Summary
    total = len(results)
    with_tags = sum(1 for r in results if r.tags_added)
    flagged = [r for r in results if r.flagged]
    renamed = [r for r in results if r.was_renamed]

    print(f"\n{'=' * 60}")
    print(f"Migration complete")
    print(f"{'=' * 60}")
    print(f"  Posts processed : {total}")
    print(f"  Tags assigned   : {with_tags}")
    print(f"  Flagged/review  : {len(flagged)}")
    print(f"  Renamed         : {len(renamed)}")
    if skipped_existing:
        print(f"  Skipped (exist) : {len(skipped_existing)} — {skipped_existing}")

    if renamed:
        print(f"\nRenames:")
        for r in renamed:
            print(f"  {r.src_stem}  →  {r.dst_stem}")

    if flagged:
        print(f"\nFlagged for review ({len(flagged)}):")
        for r in flagged:
            notes = "; ".join(r.problems)
            print(f"  [{r.dst_stem}]  {notes}")


if __name__ == "__main__":
    main()
