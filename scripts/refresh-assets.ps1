# Reproducible texture fetch. See docs/ASTRONOMY_DATA.md for attribution and limitations.
$ErrorActionPreference = 'Stop'
$assetRoot = Join-Path $PSScriptRoot '..\public\textures'
New-Item -ItemType Directory -Force -Path $assetRoot | Out-Null
$assetNames = @('8k_earth_nightmap','8k_earth_clouds','2k_moon','2k_mercury','2k_venus_atmosphere','2k_mars','2k_jupiter','2k_saturn','2k_uranus','2k_neptune','2k_sun','2k_stars_milky_way')
foreach ($assetName in $assetNames) {
  $temporary = Join-Path $assetRoot "$assetName.download"
  Invoke-WebRequest -Uri "https://www.solarsystemscope.com/textures/download/$assetName.jpg" -OutFile $temporary
  Move-Item -LiteralPath $temporary -Destination (Join-Path $assetRoot "$assetName.jpg") -Force
}
$earthTemporary = Join-Path $assetRoot 'earth.download'
Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg' -OutFile $earthTemporary
Move-Item -LiteralPath $earthTemporary -Destination (Join-Path $assetRoot 'earth.jpg') -Force
