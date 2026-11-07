"""
Cut a futureScience website release.

    python release.py --minor            # 1.0.0 -> 1.1.0, build, commit, tag v1.1.0, push, GitHub Release
    python release.py --patch --dry-run  # show what would happen, change nothing
    python release.py --publish v1.1.0   # (re)create the GitHub Release for an existing tag
    python release.py --set-version 1.2.5  # an explicit version instead of a one-step bump

Steps:
  1. Bumps the version in package.json (the single source of truth; the site
     shows it in the header, footer and <meta name="version">) and mirrors it
     into package-lock.json.
  2. Turns CHANGELOG.md's "## [Unreleased]" section into "## [X.Y.Z] - date"
     and opens a new, empty Unreleased section above it.
  3. Runs `npm run build` and `npm run seo:check`, so the version is baked into
     dist/. The build also writes dist-build.zip (dist/ contents incl. .htaccess);
     it is copied to release-dist/futurescience-site-vX.Y.Z.zip for the GitHub Release.
     Then `npm run deck` regenerates the futureScience presentation (PowerPoint) from site.js
     (release-dist/futurescience-presentation-vX.Y.Z.pptx), also attached to the Release.
     If either fails, the version and changelog edits are rolled back.
  4. Commits exactly those files ("Release vX.Y.Z"), creates an annotated tag
     vX.Y.Z, and pushes the branch and tag atomically.
  5. Creates the GitHub Release for the tag, with that version's CHANGELOG
     section as its notes and the zip attached, via the `gh` CLI. If `gh` is
     missing or not logged in (`gh auth login`), the release itself still
     succeeds and the script prints the `--publish` command to run later.

Refuses to run if the working tree is dirty, the tag already exists, the
Unreleased section is empty, or the current branch isn't main (override with
--allow-branch). Stdlib only, so there's nothing to install.
"""

import argparse
import datetime
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VERSION_FILE = ROOT / "package.json"
MIRRORS = [ROOT / "package-lock.json"]
CHANGELOG = ROOT / "CHANGELOG.md"
BUILD_ZIP = ROOT / "dist-build.zip"  # written by `npm run build` (scripts/zip-dist.mjs)
DECK = ROOT / "deck" / "futureScience-Presentation.pptx"  # written by `npm run deck`
ZIP_DIR = ROOT / "release-dist"  # gitignored
RELEASE_BRANCH = "main"

TOP_VERSION_RE = re.compile(r'^(  "version": )"[^"]*"', re.M)
UNRELEASED_RE = re.compile(r"^## \[Unreleased\][ \t]*\n(.*?)(?=^## \[|\Z)", re.M | re.S)


def fail(msg):
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(1)


def git(*args, capture=True):
    result = subprocess.run(["git", *args], cwd=ROOT, text=True, capture_output=capture)
    if result.returncode != 0:
        fail(f"git {' '.join(args)} failed:\n{result.stderr or ''}".rstrip())
    return result.stdout.strip() if capture else ""


def npm(*args):
    """Run an npm script with live output; True on success."""
    exe = shutil.which("npm")  # npm.cmd on Windows, which subprocess can't find by bare name
    if exe is None:
        fail("npm isn't on PATH")
    return subprocess.run([exe, *args], cwd=ROOT).returncode == 0


def read_version():
    version = json.loads(VERSION_FILE.read_text(encoding="utf-8")).get("version", "")
    match = re.fullmatch(r"(\d+)\.(\d+)\.(\d+)", version)
    if not match:
        fail(f'no "version": "X.Y.Z" in {VERSION_FILE.relative_to(ROOT)} (found {version!r})')
    return tuple(int(part) for part in match.groups())


def bump(version, part):
    major, minor, patch = version
    if part == "major":
        return major + 1, 0, 0
    if part == "minor":
        return major, minor + 1, 0
    return major, minor, patch + 1


def fmt(version):
    return ".".join(str(n) for n in version)


def write_version(new):
    for path in (VERSION_FILE, *MIRRORS):
        text = path.read_text(encoding="utf-8")
        if path.name == "package-lock.json":
            data = json.loads(text)
            data["version"] = new
            if "" in data.get("packages", {}):
                data["packages"][""]["version"] = new
            # npm writes JSON.stringify(data, null, 2) + "\n"; this matches it byte for byte.
            text = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
        else:
            # Only swap the top-level version line, so the rest of the file stays as written.
            text, count = TOP_VERSION_RE.subn(rf'\g<1>"{new}"', text, count=1)
            if not count:
                fail(f'no top-level "version" line in {path.relative_to(ROOT)}')
        path.write_text(text, encoding="utf-8", newline="\n")


def release_changelog(new, date):
    text = CHANGELOG.read_text(encoding="utf-8")
    match = UNRELEASED_RE.search(text)
    if not match:
        fail("CHANGELOG.md has no '## [Unreleased]' section")
    body = match.group(1)
    if not re.search(r"^\s*[-*] ", body, re.M):
        fail("CHANGELOG.md's Unreleased section has no entries; nothing to release")
    return text.replace(match.group(0), f"## [Unreleased]\n\n## [{new}] - {date}\n{body}", 1)


def pick_remote(requested):
    remotes = git("remote").split()
    if requested:
        if requested not in remotes:
            fail(f"unknown remote {requested!r} (have: {', '.join(remotes) or 'none'})")
        return requested
    if "origin" in remotes:
        return "origin"
    if len(remotes) == 1:
        return remotes[0]
    fail(f"several remotes and no 'origin'; pass one with --remote ({', '.join(remotes)})")


def changelog_section(version):
    """Body of CHANGELOG.md's "## [version] - date" section, for release notes."""
    text = CHANGELOG.read_text(encoding="utf-8")
    m = re.search(rf"^## \[{re.escape(version)}\][^\n]*\n(.*?)(?=^## \[|\Z)", text, re.M | re.S)
    return m.group(1).strip() if m else None


def zip_path(tag):
    return ZIP_DIR / f"futurescience-site-{tag}.zip"


def deck_path(tag):
    return ZIP_DIR / f"futurescience-presentation-{tag}.pptx"


def build_deck(tag):
    """Regenerate the futureScience presentation (PowerPoint) from site.js. A failure (e.g. the deck is
    open in PowerPoint) is reported but doesn't stop the release."""
    if not npm("run", "deck"):
        print("warning: the presentation wasn't rebuilt (close it in PowerPoint and run: npm run deck)")
        return
    shutil.copyfile(DECK, deck_path(tag))
    print(f"Presentation: {deck_path(tag).relative_to(ROOT)}")


def build_and_zip(tag):
    """Build the site with the new version and zip dist/; False if the build or SEO check fails."""
    if not npm("run", "build") or not npm("run", "seo:check"):
        return False
    if not BUILD_ZIP.exists():
        print(f"error: {BUILD_ZIP.name} wasn't created by the build", file=sys.stderr)
        return False
    ZIP_DIR.mkdir(exist_ok=True)
    shutil.copyfile(BUILD_ZIP, zip_path(tag))
    print(f"Upload bundle: {zip_path(tag).relative_to(ROOT)}")
    build_deck(tag)
    return True


def gh_problem():
    """None if `gh` can create releases here, else why not."""
    if shutil.which("gh") is None:
        return "the GitHub CLI (gh) isn't installed (winget install GitHub.cli)"
    r = subprocess.run(["gh", "auth", "status"], cwd=ROOT, capture_output=True, text=True)
    if r.returncode != 0:
        return "gh isn't logged in - run: gh auth login"
    return None


def publish_github_release(tag):
    """Create the GitHub Release for an already-pushed tag. Never raises: a
    failure here doesn't undo the (already pushed) release, it just says how to retry.
    """
    version = tag.lstrip("v")
    notes = changelog_section(version)
    if not notes:
        print(f"GitHub Release not created: no '## [{version}]' section in {CHANGELOG.relative_to(ROOT)}.")
        return False
    problem = gh_problem()
    if problem:
        print(f"GitHub Release not created: {problem}.\nWhen ready: python release.py --publish {tag}")
        return False
    notes_file = ROOT / ".git" / f"release-notes-{tag}.md"  # inside .git: never committed
    notes_file.write_text(notes + "\n", encoding="utf-8")
    cmd = ["gh", "release", "create", tag, "--title", tag, "--notes-file", str(notes_file), "--verify-tag"]
    if zip_path(tag).exists():
        cmd.append(f"{zip_path(tag)}#Website upload bundle (extract into public_html)")
    else:
        print(f"note: {zip_path(tag).relative_to(ROOT)} not found, publishing without the upload bundle")
    if deck_path(tag).exists():
        cmd.append(f"{deck_path(tag)}#futureScience presentation (PowerPoint, export as video)")
    r = subprocess.run(cmd, cwd=ROOT, text=True, capture_output=True)
    notes_file.unlink(missing_ok=True)
    if r.returncode != 0:
        print(
            f"GitHub Release not created:\n{(r.stderr or r.stdout).strip()}\n"
            f"(If it already exists, edit it on GitHub or delete it and run: python release.py --publish {tag})"
        )
        return False
    print(f"GitHub Release {tag} created: {r.stdout.strip()}")
    return True


def get_args_parser():
    parser = argparse.ArgumentParser(description="Cut a futureScience website release.")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("-j", "--major", action="store_true", help="X.0.0 - redesign or big restructure")
    group.add_argument("-n", "--minor", action="store_true", help="x.Y.0 - new pages, sections or features")
    group.add_argument("-p", "--patch", action="store_true", help="x.y.Z - content updates and fixes")
    group.add_argument(
        "--set-version", metavar="X.Y.Z", help="release exactly this version (must be higher than the current one)"
    )
    group.add_argument("--publish", metavar="vX.Y.Z", help="only create the GitHub Release for an existing, pushed tag")
    parser.add_argument("-d", "--dry-run", action="store_true", help="print the plan, change nothing")
    parser.add_argument("-r", "--remote", help="git remote to push to (default: origin)")
    parser.add_argument("--no-push", action="store_true", help="commit and tag locally, don't push")
    parser.add_argument("--no-github-release", action="store_true", help="don't create the GitHub Release after pushing")
    parser.add_argument("--allow-branch", action="store_true", help=f"release from a branch other than {RELEASE_BRANCH}")
    return parser


def main():
    args = get_args_parser().parse_args()
    if args.publish:
        tag = args.publish if args.publish.startswith("v") else f"v{args.publish}"
        if not git("tag", "--list", tag):
            fail(f"tag {tag} doesn't exist locally (git fetch --tags?)")
        sys.exit(0 if publish_github_release(tag) else 1)
    current = read_version()
    if args.set_version:
        m = re.fullmatch(r"(\d+)\.(\d+)\.(\d+)", args.set_version.lstrip("v"))
        if not m:
            fail(f"--set-version {args.set_version!r} isn't X.Y.Z")
        target = tuple(int(x) for x in m.groups())
        if target <= current:
            fail(f"--set-version {fmt(target)} must be higher than the current {fmt(current)}")
        part, new = "explicit", fmt(target)
    else:
        part = "major" if args.major else "minor" if args.minor else "patch"
        new = fmt(bump(current, part))
    tag = f"v{new}"
    date = datetime.date.today().isoformat()

    # ── Preflight: fail before touching anything ─────────────────────────────
    branch = git("rev-parse", "--abbrev-ref", "HEAD")
    if branch != RELEASE_BRANCH and not args.allow_branch:
        fail(f"on branch {branch!r}; releases are cut from {RELEASE_BRANCH!r} (merge first, or pass --allow-branch)")
    if git("status", "--porcelain"):
        fail("working tree has uncommitted changes; commit or stash them first")
    if git("tag", "--list", tag):
        fail(f"tag {tag} already exists")
    remote = None if args.no_push else pick_remote(args.remote)
    changelog = release_changelog(new, date)

    print(f"Releasing {fmt(current)} -> {new} ({part}) on {branch}")
    print(f"  version  : {VERSION_FILE.relative_to(ROOT)}, {', '.join(str(p.relative_to(ROOT)) for p in MIRRORS)}")
    print(f"  changelog: [Unreleased] -> [{new}] - {date}")
    print(f"  build    : npm run build + seo:check -> {zip_path(tag).relative_to(ROOT)}")
    print(f"  git      : commit 'Release {tag}', annotated tag {tag}")
    print(f"  push     : {'skipped (--no-push)' if args.no_push else f'{remote} {branch} + {tag} (atomic)'}")
    if args.no_push or args.no_github_release:
        gh_plan = "skipped"
    else:
        problem = gh_problem()
        gh_plan = f"create {tag} with the CHANGELOG notes + upload zip" if not problem else f"WILL BE SKIPPED - {problem}"
    print(f"  github   : {gh_plan}")

    if args.dry_run:
        print("\nDry run - nothing changed.")
        return

    # ── Apply ─────────────────────────────────────────────────────────────────
    files = [VERSION_FILE, *MIRRORS, CHANGELOG]
    write_version(new)
    CHANGELOG.write_text(changelog, encoding="utf-8", newline="\n")

    if not build_and_zip(tag):
        git("checkout", "--", *(str(f.relative_to(ROOT)) for f in files))
        fail("build or SEO check failed; version and changelog changes rolled back")

    git("add", "--", *(str(f.relative_to(ROOT)) for f in files))
    git("commit", "-m", f"Release {tag}")
    git("tag", "-a", tag, "-m", f"Release {tag}")
    print(f"\nCommitted and tagged {tag}.")

    if args.no_push:
        print(f"Not pushed. When ready: git push --atomic <remote> {branch} {tag}")
        return
    git("push", "--atomic", remote, branch, tag, capture=False)
    print(f"Pushed {branch} and {tag} to {remote}.")
    if not args.no_github_release:
        publish_github_release(tag)
    print(f"\nTo go live: extract {zip_path(tag).relative_to(ROOT)} into public_html (keep .htaccess).")


if __name__ == "__main__":
    main()
