"""Builds the animated logos from the two logos in scripts/logo-src/futureScience-logos.pdf
(IIT-Medical Academy and Private Tutorials):

- public/images/logo-academy.gif (website header and footer, 420px, ~13.6s loop):
  the ring draws from the top, the fS mark rises in, the Academy wordmark builds (two text lines
  wipe in, the lime rule and navy bar grow, one sheen crosses the bar) and holds; it wipes out and
  the Private Tutorials wordmark builds and holds; everything fades and the loop restarts.
- scripts/logo-src/logo-academy-deck.gif (presentation, 1000px, opaque white): starts and ends on the finished Academy logo,
  because PowerPoint restarts a GIF on every slide (each deck scene is four Morph slides) and a
  restart must not be visible. Academy holds, swaps to Private Tutorials, holds, swaps back.

Masters (1240px, rendered from the PDF): public/images/logo-academy.png (also the site's still logo,
for reduced motion and the JSON-LD) and scripts/logo-src/logo-tutorials.png. The ring and fS mark always
come from the Academy logo; the Tutorials wordmark is moved to start where the Academy one does.

Run: python scripts/make-logo-gif.py   (needs Pillow; both GIFs are committed, so builds don't need it)
     python scripts/make-logo-gif.py --deck   (deck GIF only)
"""
import sys
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC_A = ROOT / 'public' / 'images' / 'logo-academy.png'
SRC_B = ROOT / 'scripts' / 'logo-src' / 'logo-tutorials.png'

FPS = 15
BG = (255, 255, 255)  # edges are smoothed against white: the header, footer and deck logo plates are (near) white

A = Image.open(SRC_A).convert('RGBA')
B = Image.open(SRC_B).convert('RGBA')
W, H = A.size
k = W / 2477          # coordinates below were measured on 2477px renders of the PDF pages
EMPTY = Image.new('RGBA', (W, H), (0, 0, 0, 0))

# Academy logo: ring centre, the radius between ring and fS mark, where the wordmark starts
CX, CY, R_SPLIT = 318 * k, 322 * k, 238 * k
SPLIT_X = 640 * k


def box_mask(box):
    m = Image.new('L', (W, H), 0)
    ImageDraw.Draw(m).rectangle(box, fill=255)
    return m


def cut(img, mask):
    out = EMPTY.copy()
    out.paste(img, (0, 0), ImageChops.multiply(img.getchannel('A'), mask))
    return out


inner = Image.new('L', (W, H), 0)
ImageDraw.Draw(inner).ellipse((CX - R_SPLIT, CY - R_SPLIT, CX + R_SPLIT, CY + R_SPLIT), fill=255)
left = box_mask((0, 0, SPLIT_X, H))
ring = cut(A, ImageChops.subtract(left, inner))
mark = cut(A, ImageChops.multiply(left, inner))


def wordmark(img, x0, rows, dx=0):
    """Split a wordmark into [line 1, line 2, rule, bar] layers (shifted by dx), with its x range and bar box."""
    r1, r2, r3 = (r * k for r in rows)
    parts = [cut(img, box_mask(b)) for b in ((x0, 0, W, r1), (x0, r1, W, r2), (x0, r2, W, r3 - 1), (x0, r3, W, H))]
    if dx:
        parts = [ImageChops.offset(p, round(dx), 0) for p in parts]
    whole = EMPTY.copy()
    for p in parts:
        whole.alpha_composite(p)
    return {
        'parts': parts,
        'whole': whole,
        'left': min(p.getbbox()[0] for p in parts),
        'right': max(p.getbbox()[2] for p in parts),
        'bar': parts[3].getbbox(),
    }


ACADEMY = wordmark(A, SPLIT_X, (228, 368, 401))
TUTORIALS = wordmark(B, 735 * k, (225, 395, 426), dx=(665 - 749) * k)  # its bar starts where the Academy bar does


def clamp(v):
    return max(0.0, min(1.0, v))


def prog(t, start, dur):
    return clamp((t - start) / dur)


def ease_out(p):
    return 1 - (1 - p) ** 3


def ease_in_out(p):
    return 3 * p * p - 2 * p ** 3


def fade(img, a):
    if a >= 1:
        return img
    out = img.copy()
    out.putalpha(out.getchannel('A').point(lambda v: int(v * a)))
    return out


def wipe(img, p, x_from, x_to, soft=36 * k, reveal=True):
    """reveal=True shows img from x_from towards x_to with a soft edge; False hides it the same way."""
    if p <= 0:
        return None if reveal else img
    if p >= 1:
        return img if reveal else None
    edge = x_from + (x_to - x_from + soft) * p
    m = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(m)
    d.rectangle((0, 0, edge - soft, H), fill=255)
    steps = max(1, int(soft))
    for i in range(steps):  # linear ramp across the soft edge
        x = edge - soft + i
        d.line((x, 0, x, H), fill=int(255 * (1 - i / steps)))
    return cut(img, m if reveal else ImageChops.invert(m))


def sheen(bar_box, p):
    band = EMPTY.copy()
    x0, y0, x1, y1 = bar_box
    x = x0 - 120 * k + (x1 - x0 + 240 * k) * ease_out(p)
    ImageDraw.Draw(band).polygon([(x, y0), (x + 70 * k, y0), (x + 20 * k, y1), (x - 50 * k, y1)], fill=(255, 255, 255, 70))
    return band


# A wordmark build: line 1 at +0, line 2 +0.25, rule +0.6, bar +0.8, sheen +1.5 (done at +2.2)
BUILD = ((0.0, 0.6), (0.25, 0.6), (0.6, 0.45), (0.8, 0.5))
SHEEN_AT, SHEEN_DUR = 1.5, 0.7
BUILT = SHEEN_AT + SHEEN_DUR
OUT_DUR = 0.45   # a wordmark wiping out
GAP = 0.35       # from a wipe-out starting to the next wordmark starting


def words(canvas, t, schedule):
    """schedule: [(wordmark, t_in, t_out or None)]. Builds each in at t_in and wipes it out at t_out."""
    for wm, t_in, t_out in schedule:
        if t_out is None or t < t_out:
            for part, (start, dur) in zip(wm['parts'], BUILD):
                w = wipe(part, ease_out(prog(t, t_in + start, dur)), wm['left'], wm['right'])
                if w is not None:
                    canvas.alpha_composite(w)
            p = prog(t, t_in + SHEEN_AT, SHEEN_DUR)
            if 0 < p < 1:
                canvas.alpha_composite(cut(sheen(wm['bar'], p), wm['parts'][3].getchannel('A')))
        else:
            w = wipe(wm['whole'], ease_in_out(prog(t, t_out, OUT_DUR)), wm['left'], wm['right'], reveal=False)
            if w is not None:
                canvas.alpha_composite(w)


def frame(t, v, size):
    canvas = EMPTY.copy()

    p = ease_out(prog(t, v['ring_at'], 0.75))  # both ring halves draw from the top and meet at the bottom
    if p > 0:
        sweep = Image.new('L', (W, H), 0)
        R = 330 * k
        ImageDraw.Draw(sweep).pieslice((CX - R, CY - R, CX + R, CY + R), 270 - 180 * p, 270 + 180 * p, fill=255)
        canvas.alpha_composite(cut(ring, sweep))

    p = prog(t, v['ring_at'] + 0.35, 0.55)  # fS mark rises into view from the bottom of the ring while fading in
    if p > 0:
        top = CY + R_SPLIT - 2 * R_SPLIT * ease_out(p)
        canvas.alpha_composite(fade(cut(mark, box_mask((0, top, W, H))), clamp(p * 1.6)))

    words(canvas, t, v['schedule'])

    if v.get('fade_at') is not None and t > v['fade_at']:
        canvas = fade(canvas, 1 - ease_in_out(prog(t, v['fade_at'], 0.4)))

    flat = Image.new('RGBA', (W, H), BG + (255,))
    flat.alpha_composite(canvas)
    # Colour blended on white, plus coverage: only uncovered pixels become transparent, so the white
    # lettering on the navy bar stays solid white instead of sharing the transparent index
    return flat.convert('RGB').resize(size, Image.LANCZOS), canvas.getchannel('A').resize(size, Image.LANCZOS)


# Website: draws in from nothing, Academy → Tutorials, fades, restarts
A_IN = 0.7
A_OUT = A_IN + 6.0            # Academy built and still for about 3.8s
B_IN = A_OUT + GAP
FADE_AT = B_IN + 6.0
WEB = {
    'out': ROOT / 'public' / 'images' / 'logo-academy.gif',
    'width': 420,             # 2x the ~205px it shows at in the header: sharp on phones, and the file stays small
    'colours': 63,
    'ring_at': 0.0,
    'schedule': [(ACADEMY, A_IN, A_OUT), (TUTORIALS, B_IN, None)],
    'fade_at': FADE_AT,
    'length': FADE_AT + 0.4 + 0.12,
}

# Deck: starts and ends on the finished Academy logo, so a restart on each slide can't be seen
D_A_OUT = 3.0
D_B_IN = D_A_OUT + GAP
D_B_OUT = D_B_IN + BUILT + 3.0
D_A_IN = D_B_OUT + GAP
DECK = {
    'out': ROOT / 'scripts' / 'logo-src' / 'logo-academy-deck.gif',  # committed: npm run deck reads it
    'width': 1000,            # the opening logo is about 800px wide in a 1080p export
    'colours': 127,
    'ring_at': -5.0,          # ring and fS already drawn
    'schedule': [(ACADEMY, -5.0, D_A_OUT), (TUTORIALS, D_B_IN, D_B_OUT), (ACADEMY, D_A_IN, None)],
    'fade_at': None,
    'length': D_A_IN + BUILT + 0.4,
    'opaque': True,           # it sits on the deck's white logo plate, so no transparency (and no disposal edge cases)
}


def make(v):
    size = (v['width'], round(H * v['width'] / W))
    rendered = [frame(i / FPS, v, size) for i in range(round(v['length'] * FPS))]
    colours = v['colours']
    clear_index = colours  # one palette slot past the logo's colours, reserved for the transparent background

    # Palette from frames with each wordmark fully built and mid-sheen, so it covers every colour shown
    samples = []
    for wm, t_in, t_out in v['schedule']:
        samples += [max(0.0, t_in + BUILT + 0.1), max(0.0, t_in + SHEEN_AT + 0.3)]
    samples = [s for s in samples if s * FPS < len(rendered)]
    palette_src = Image.new('RGB', (size[0], size[1] * len(samples)))
    for i, s in enumerate(samples):
        palette_src.paste(rendered[round(s * FPS)][0], (0, i * size[1]))
    pal = palette_src.quantize(colors=colours, method=Image.Quantize.MEDIANCUT)
    # The transparent slot gets a colour the logo never uses (it is never shown). If it were white like the
    # lettering, Pillow would treat 'transparent' and 'solid white' as the same and merge frames wrongly.
    palette = (pal.getpalette()[:colours * 3] + [0, 0, 0] * colours)[:colours * 3] + [255, 0, 255]

    # Quantize, then merge runs of identical frames here (summing their time). Pillow would merge them too,
    # but its merged frame keeps the first frame's disposal, and the run's last frame is the one that matters.
    frames, clear_masks, durations = [], [], []
    step = 1000 / FPS
    for rgb, alpha in rendered:
        f = rgb.quantize(palette=pal, dither=Image.Dither.NONE)
        assert max(f.getextrema()) < colours
        clear = alpha.point(lambda a: 255 if a < 8 else 0)
        if v.get('opaque'):
            clear = Image.new('L', size, 0)
        else:
            f.paste(clear_index, mask=clear)
        f.putpalette(palette)
        if not v.get('opaque'):
            f.info['transparency'] = clear_index  # so the check below sees the slot as transparent too
        same = frames and f.tobytes() == frames[-1].tobytes()
        empty = frames and not ImageChops.invert(clear).getbbox()  # Pillow also drops a blank frame after a cleared one
        if same or empty:
            durations[-1] += step
            continue
        frames.append(f)
        clear_masks.append(clear)
        durations.append(step)
    durations = [max(20, round(d / 10) * 10) for d in durations]  # GIF delays are in hundredths of a second

    # disposal=1 (keep) gives small delta frames, but there a transparent pixel shows the previous frame.
    # So a frame whose successor uncovers pixels (wipe-out, fade, loop restart) gets disposal=2 (clear).
    disposal = []
    for i, m in enumerate(clear_masks):
        uncovered = ImageChops.subtract(clear_masks[(i + 1) % len(frames)], m)
        disposal.append(2 if uncovered.getbbox() else 1)

    v['out'].parent.mkdir(parents=True, exist_ok=True)
    # loop=0 repeats forever. optimize=False: palette optimisation renumbers colours and loses the transparent index.
    alpha_opts = {} if v.get('opaque') else {'transparency': clear_index, 'background': clear_index}
    frames[0].save(v['out'], save_all=True, append_images=frames[1:], duration=durations, loop=0,
                   optimize=False, disposal=disposal, **alpha_opts)

    # Check: decode the GIF (Pillow applies disposal like a browser) and compare every frame with the intended one
    def on_tint(img):
        out = Image.new('RGBA', size, (225, 235, 210, 255))
        out.alpha_composite(img.convert('RGBA'))
        return out.convert('RGB')

    gif = Image.open(v['out'])
    assert gif.n_frames == len(frames), 'the encoder merged frames; the disposal check no longer lines up'
    bad = []
    for i in range(gif.n_frames):
        gif.seek(i)
        diff = ImageChops.difference(on_tint(gif), on_tint(frames[i])).convert('L').point(lambda px: 255 if px > 40 else 0)
        if diff.getbbox():
            bad.append(f'frame {i} (disposal {disposal[i - 1] if i else "-"} before it): {diff.getbbox()}')
    assert not bad, 'frames differ from the intended image (ghosting):\n' + '\n'.join(bad)
    print(f'{v["out"].relative_to(ROOT)}: {len(frames)} frames, '
          f'{v["length"]:.1f}s loop, {size[0]}x{size[1]}, {v["out"].stat().st_size / 1024:.0f} KB, every frame checked')


if __name__ == '__main__':
    for variant in ([DECK] if '--deck' in sys.argv else [WEB, DECK]):
        make(variant)
