---
name: release
description: Cut a new version of the futureScience website (bump version, changelog, build, tag, push, GitHub Release, upload zip). Use when the user asks to release, publish, ship, deploy, bump the version, or "make a new set" of the site.
---

# Release workflow

1. **Read** `.claude/rules/deploy.md` (Versioning + Release checklist).
2. **Pick the version.** Use the number the user names (`--set-version X.Y.Z`). Otherwise:
   - patch: content or fixes
   - minor: new sections or features
   - major: a redesign
3. **Changelog:** make sure `## [Unreleased]` in `CHANGELOG.md` lists every change since the last tag (`git log <last-tag>..HEAD`). Write plain, user-facing bullets under `### Added` / `### Changed` / `### Fixed`.
4. **Brochure:** if `src/brochure/` or brochure content in `site.js` changed, run `npm run brochure` and commit the PDFs first.
5. **Commit** the pending work with a descriptive message. `release.py` refuses a dirty tree.
6. **Dry run:** `python release.py <bump> --dry-run`, then the real run. Prepend `export PATH="$PATH:/c/Program Files/GitHub CLI"` in Bash so `gh` is found.
7. **If the GitHub Release was skipped** (gh not logged in), tell the user to run `gh auth login --web` and then `python release.py --publish vX.Y.Z`. Don't try to read stored git credentials to work around it.
8. **Verify:**
   - `grep 'name="version"' dist/index.html` shows the new version
   - `seo:check` passed
   - `dist-build.zip` and the copy in `release-dist/` exist and contain `.htaccess`
   - `release-dist/futurescience-website-tour-vX.Y.Z.pptx` exists (if the deck step warned, close the deck in PowerPoint, run `npm run deck`, and attach it with `gh release upload vX.Y.Z <file>`)
   - delete older zips there so the wrong one can't be uploaded
9. **Report:** version, commit and tag pushed, Release link or the pending `--publish` command, the zip path (`dist-build.zip` is the same file), and the reminder to upload it to `public_html` and extract it.

Never delete or move a pushed tag, and never force-push `main`. If a version was wrong, release the next one.
