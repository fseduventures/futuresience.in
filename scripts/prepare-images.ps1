# One-time asset prep: copies/resizes media from the old WordPress uploads
# into public/images. Re-run only if you want to regenerate the images.
param(
  [string]$Uploads = (Join-Path $PSScriptRoot '..\..\wp-content\uploads'),
  [string]$Out = (Join-Path $PSScriptRoot '..\public\images')
)
Add-Type -AssemblyName System.Drawing
$jpeg = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object Drawing.Imaging.EncoderParameter ([Drawing.Imaging.Encoder]::Quality, [long]82)

function Save-Resized($src, $dest, $maxW, [switch]$Png) {
  $img = [Drawing.Image]::FromFile($src)
  $w = [Math]::Min($maxW, $img.Width); $h = [int]($img.Height * $w / $img.Width)
  $bmp = New-Object Drawing.Bitmap $w, $h
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'
  if (-not $Png) { $g.Clear([Drawing.Color]::White) }
  $g.DrawImage($img, 0, 0, $w, $h)
  if ($Png) { $bmp.Save($dest, [Drawing.Imaging.ImageFormat]::Png) } else { $bmp.Save($dest, $jpeg, $params) }
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
}

function Save-Crop($src, $dest, $x, $y, $w, $h) {
  $img = [Drawing.Image]::FromFile($src)
  $bmp = New-Object Drawing.Bitmap $w, $h
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.DrawImage($img, (New-Object Drawing.Rectangle 0, 0, $w, $h), (New-Object Drawing.Rectangle $x, $y, $w, $h), 'Pixel')
  $bmp.Save($dest, $jpeg, $params)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
}

$u = (Resolve-Path $Uploads).Path
New-Item -ItemType Directory -Force $Out, "$Out\achievers" | Out-Null

# Logos keep transparency
Save-Resized "$u\2024\04\fSPT-Logo-New-Green_tag.png" "$Out\logo-tag.png" 720 -Png
Save-Resized "$u\2024\04\fSPT-Logo-New-Green.png" "$Out\logo.png" 720 -Png
Save-Resized "$u\2024\04\fS.png" "$Out\fs-mark.png" 256 -Png
Save-Resized "$u\2025\04\STEMQUEST-Final_.png" "$Out\stemquest.png" 450 -Png
Save-Resized "$u\2024\04\Study-Abroad_-1.png" "$Out\study-abroad.png" 200 -Png
Save-Resized "$u\2024\04\Test-Series-Logo_.png" "$Out\test-series.png" 200 -Png
Save-Resized "$u\2024\04\inspiring-Innovation_.png" "$Out\inspiring-innovation.png" 640 -Png
Save-Resized "$u\2024\04\Vision-for-Fut.png" "$Out\vision.png" 640 -Png

# Photos -> JPEG
$photos = @{
  'hero-cosmos.jpg'        = '2024\04\Untitled-1.jpg'
  'mindset.jpg'            = '2024\04\Scientific-MindSet.png'
  'innovation-bulb.jpg'    = '2024\04\Compre.png'
  'education.jpg'          = '2024\04\Transforming-Education.jpg'
  'board.jpg'              = '2024\04\Board.jpg'
  'ai.jpg'                 = '2024\04\AI.jpg'
  'scientist.jpg'          = '2024\04\Scientist_.jpg'
  'medical-tech.jpg'       = '2024\04\medical-technology.png'
  'ladder.jpg'             = '2024\04\Ladder.png'
  'astronaut.jpg'          = '2023\05\astronaut-spaceman-do-spacewalk-scaled.jpg'
  'ai-ml.jpg'              = '2023\05\Artificial-Intelligence-and-Machine-Learning.png'
  'industrial.jpg'         = '2023\05\IndustrialMachine.jpg'
  'microscope.jpg'         = '2024\04\scientist-looking-through-microscopeRHS.png'
  'learner.jpg'            = '2024\04\20547283_6310507.jpg'
  'brochure-achievers.jpg' = '2025\05\Brochure-2025-27_Testimonials_Curves-pdf.jpg'
}
foreach ($k in $photos.Keys) { Save-Resized "$u\$($photos[$k])" "$Out\$k" 1600 }

# Student portraits cropped from the Achievers-2024 brochure
$b = "$u\2025\05\Brochure-2025-27_Testimonials_Curves-pdf.jpg"
Save-Crop $b "$Out\achievers\lyra-uchil.jpg"     263 140 207 248
Save-Crop $b "$Out\achievers\atharv-vedant.jpg"  636 140 205 245
Save-Crop $b "$Out\achievers\tanisha-shah.jpg"    87 640 118 142
Save-Crop $b "$Out\achievers\atharv-patil.jpg"   277 640 118 142
Save-Crop $b "$Out\achievers\dhuin-begani.jpg"   469 640 118 142
Save-Crop $b "$Out\achievers\jaypreet-panchal.jpg" 662 640 118 142
Save-Crop $b "$Out\achievers\vir-mehta.jpg"      855 640 118 142
Save-Crop $b "$Out\achievers\tvisha-vedant.jpg"  605 1003 178 168
Write-Host 'Images prepared.'
