"""
Export the futureScience presentation to an MP4 video with PowerPoint itself.

    python scripts/export_video.py                 # deck/futureScience-Presentation.pptx -> .mp4, 1080p 30fps
    python scripts/export_video.py --build         # rebuild the deck first (npm run deck)
    python scripts/export_video.py --height 2160   # 4K
    npm run video                                  # same as the first line

PowerPoint's own "Create a Video" engine renders the Morph transitions and the preset slide
timings exactly as the slideshow plays. It's driven through Windows COM via PowerShell, so the
script needs only the standard library (Windows + PowerPoint required). Rendering takes a few
minutes; progress is printed. Close the .pptx in PowerPoint first.
"""

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_PPTX = ROOT / "deck" / "futureScience-Presentation.pptx"

# PowerPoint COM: Presentations.Open(file, ReadOnly, Untitled, WithWindow) and
# Presentation.CreateVideo(file, UseTimingsAndNarrations, DefaultSlideDuration, VertResolution, FramesPerSecond, Quality).
# CreateVideoStatus: 1 queued, 2 in progress, 3 done, 4 failed. Paths come in through environment
# variables so nothing in them is ever parsed as PowerShell.
POWERSHELL = r"""
$ErrorActionPreference = 'Stop'
$app = New-Object -ComObject PowerPoint.Application
try {
  $p = $app.Presentations.Open($env:FS_PPTX, -1, 0, 0)
  $p.CreateVideo($env:FS_MP4, $true, 5, [int]$env:FS_HEIGHT, [int]$env:FS_FPS, [int]$env:FS_QUALITY)
  $last = -1
  do {
    Start-Sleep -Seconds 2
    $status = $p.CreateVideoStatus
    if (Test-Path $env:FS_MP4) {
      $mb = [math]::Round((Get-Item $env:FS_MP4).Length / 1MB, 1)
      if ($mb -ne $last) { Write-Output "  rendering... $mb MB"; $last = $mb }
    }
  } while ($status -eq 1 -or $status -eq 2)
  $p.Close()
  if ($status -ne 3) { throw "PowerPoint reported status $status (4 = failed)" }
} finally {
  $app.Quit()
}
"""


def main():
    parser = argparse.ArgumentParser(description="Export the futureScience presentation to MP4 with PowerPoint.")
    parser.add_argument("--pptx", type=Path, default=DEFAULT_PPTX, help="presentation to export")
    parser.add_argument("--out", type=Path, help="video file (default: next to the .pptx, .mp4)")
    parser.add_argument("--height", type=int, default=1080, choices=[480, 720, 1080, 2160], help="vertical resolution")
    parser.add_argument("--fps", type=int, default=30, help="frames per second")
    parser.add_argument("--quality", type=int, default=90, help="1-100")
    parser.add_argument("--build", action="store_true", help="run `npm run deck` first")
    args = parser.parse_args()

    if sys.platform != "win32":
        sys.exit("error: needs Windows with Microsoft PowerPoint")
    if args.build:
        npm = shutil.which("npm") or sys.exit("error: npm isn't on PATH")
        if subprocess.run([npm, "run", "deck"], cwd=ROOT).returncode:
            sys.exit("error: building the deck failed")
    pptx = args.pptx.resolve()
    if not pptx.exists():
        sys.exit(f"error: {pptx} not found (run: npm run deck)")
    mp4 = (args.out or pptx.with_suffix(".mp4")).resolve()
    try:
        mp4.unlink(missing_ok=True)  # PowerPoint won't overwrite
    except PermissionError:
        sys.exit(f"error: {mp4.name} is open in another program; close it and run again")

    print(f"Exporting {pptx.name} -> {mp4.name} ({args.height}p, {args.fps} fps, quality {args.quality})")
    env = {**os.environ, "FS_PPTX": str(pptx), "FS_MP4": str(mp4), "FS_HEIGHT": str(args.height), "FS_FPS": str(args.fps), "FS_QUALITY": str(args.quality)}
    r = subprocess.run(["powershell", "-NoProfile", "-NonInteractive", "-Command", POWERSHELL], env=env)
    if r.returncode or not mp4.exists():
        sys.exit("error: the export failed (is the .pptx open in PowerPoint?)")
    print(f"✓ {mp4.relative_to(ROOT) if mp4.is_relative_to(ROOT) else mp4}: {mp4.stat().st_size / 1024 / 1024:.1f} MB")


if __name__ == "__main__":
    main()
