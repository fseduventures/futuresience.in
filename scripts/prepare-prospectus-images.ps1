# One-time asset prep from the 2023-25 prospectus PDF.
# Step 1: node scripts/pdf-tools/extract-jpegs.mjs prospectus.pdf <Src>
#         node scripts/pdf-tools/smask.mjs prospectus.pdf <Src> 628 630   (transparency masks for the mentor cut-outs)
# Step 2: this script crops/resizes them into public/images.
param(
  [Parameter(Mandatory = $true)][string]$Src,
  [string]$Out = (Join-Path $PSScriptRoot '..\public\images')
)
Add-Type -AssemblyName System.Drawing
$jpeg = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object Drawing.Imaging.EncoderParameter ([Drawing.Imaging.Encoder]::Quality, [long]85)

function Find($id) { (Get-ChildItem "$Src\obj$($id)_*.jpg" | Select-Object -First 1).FullName }

# Crop (x,y,w,h in source pixels; omit for full image), optionally rotate, then fit to $maxW
function Save($id, $dest, $maxW, $crop = $null, $rotate = $null) {
  $img = [Drawing.Image]::FromFile((Find $id))
  if ($rotate) { $img.RotateFlip($rotate) }
  if (-not $crop) { $crop = @(0, 0, $img.Width, $img.Height) }
  $w = [Math]::Min($maxW, $crop[2]); $h = [int]($crop[3] * $w / $crop[2])
  $bmp = New-Object Drawing.Bitmap $w, $h
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.DrawImage($img, (New-Object Drawing.Rectangle 0, 0, $w, $h), (New-Object Drawing.Rectangle $crop[0], $crop[1], $crop[2], $crop[3]), 'Pixel')
  $bmp.Save($dest, $jpeg, $params)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
}

# Applies the PDF's soft mask as alpha, producing a transparent PNG cut-out
function SaveCutout($id, $dest) {
  $img = New-Object Drawing.Bitmap (Find $id)
  $mask = New-Object Drawing.Bitmap "$Src\mask$id.bmp"
  $w = $img.Width; $h = $img.Height
  $rect = New-Object Drawing.Rectangle 0, 0, $w, $h
  $out = New-Object Drawing.Bitmap $w, $h, ([Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [Drawing.Graphics]::FromImage($out); $g.DrawImage($img, $rect); $g.Dispose()
  $od = $out.LockBits($rect, 'ReadWrite', ([Drawing.Imaging.PixelFormat]::Format32bppArgb))
  $md = $mask.LockBits($rect, 'ReadOnly', ([Drawing.Imaging.PixelFormat]::Format32bppArgb))
  $px = New-Object byte[] ($od.Stride * $h); $mk = New-Object byte[] ($md.Stride * $h)
  [Runtime.InteropServices.Marshal]::Copy($od.Scan0, $px, 0, $px.Length)
  [Runtime.InteropServices.Marshal]::Copy($md.Scan0, $mk, 0, $mk.Length)
  # alpha = PDF soft mask, faded to transparent over the bottom 22% (baked in, so no CSS mask is needed)
  $fadeStart = [int]($h * 0.78)
  for ($i = 0; $i -lt $px.Length; $i += 4) {
    $y = [Math]::Floor($i / $od.Stride)
    $a = $mk[$i]
    if ($y -gt $fadeStart) { $a = [int]($a * (1 - ($y - $fadeStart) / ($h - $fadeStart))) }
    $px[$i + 3] = $a
  }
  [Runtime.InteropServices.Marshal]::Copy($px, 0, $od.Scan0, $px.Length)
  $out.UnlockBits($od); $mask.UnlockBits($md)
  $out.Save($dest, [Drawing.Imaging.ImageFormat]::Png)
  $out.Dispose(); $mask.Dispose(); $img.Dispose()
}

New-Item -ItemType Directory -Force "$Out\mentors", "$Out\alumni", "$Out\gallery", "$Out\achievers" | Out-Null

# Mentors: transparent cut-outs (the raw photos have mirrored-tile edges hidden by a mask in the PDF)
SaveCutout 628 "$Out\mentors\nilesh-vedant.png"
SaveCutout 630 "$Out\mentors\prasanna-raut.png"

# Results
Save 665 "$Out\achievers\shrey-soni.jpg" 600 @(20, 0, 496, 620)
Save 619 "$Out\achievers\tvisha-vedant-hq.jpg" 600 @(112, 316, 520, 520)

# Testimonial portraits
Save 700 "$Out\alumni\rajal-jani.jpg" 300
Save 701 "$Out\alumni\anuja-pradhan.jpg" 300
Save 702 "$Out\alumni\manish-talekar.jpg" 300 $null ([Drawing.RotateFlipType]::Rotate90FlipNone)
Save 707 "$Out\alumni\shreyas-patil.jpg" 300
Save 709 "$Out\alumni\noopur-mehta.jpg" 300
Save 710 "$Out\alumni\akshay-raut.jpg" 300
Save 711 "$Out\alumni\duhita-pawar.jpg" 300
Save 712 "$Out\alumni\rashmita-shettigar.jpg" 300
Save 698 "$Out\alumni\bits-alumnus.jpg" 300

# Life at futureScience
Save 666 "$Out\gallery\batch-celebration.jpg" 1400
Save 662 "$Out\gallery\results-day.jpg" 1300
Save 664 "$Out\gallery\felicitation.jpg" 900
Save 671 "$Out\gallery\lecture.jpg" 1400
Save 673 "$Out\gallery\christmas.jpg" 1300
Save 681 "$Out\gallery\sunday-test.jpg" 600

# Grayscale lecture photo for dark section backgrounds (baked, so no CSS filter is needed)
$colour = New-Object Drawing.Bitmap "$Out\gallery\lecture.jpg"
$mono = New-Object Drawing.Bitmap $colour.Width, $colour.Height
$g = [Drawing.Graphics]::FromImage($mono)
$cm = New-Object Drawing.Imaging.ColorMatrix (, [single[][]]@(
  [single[]]@(0.3, 0.3, 0.3, 0, 0), [single[]]@(0.59, 0.59, 0.59, 0, 0), [single[]]@(0.11, 0.11, 0.11, 0, 0),
  [single[]]@(0, 0, 0, 1, 0), [single[]]@(0, 0, 0, 0, 1)))
$ia = New-Object Drawing.Imaging.ImageAttributes; $ia.SetColorMatrix($cm)
$g.DrawImage($colour, (New-Object Drawing.Rectangle 0, 0, $colour.Width, $colour.Height), 0, 0, $colour.Width, $colour.Height, 'Pixel', $ia)
$colour.Dispose()
$mono.Save("$Out\gallery\lecture-mono.jpg", $jpeg, $params)
$g.Dispose(); $mono.Dispose()
Write-Host 'Prospectus images prepared.'
