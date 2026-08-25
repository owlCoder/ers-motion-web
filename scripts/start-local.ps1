$ErrorActionPreference = 'Stop'

$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host "ERS Studio - local setup" -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw "Node.js nije pronađen. Instaliraj Node.js 22 LTS i ponovo pokreni skriptu."
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw "npm nije pronađen u PATH-u."
}

$nodeVersion = node --version
Write-Host "Node: $nodeVersion"
Write-Host "npm:  $(npm --version)"

$needsInstall = -not (Test-Path "node_modules\@fluentui\react-components") -or -not (Test-Path "node_modules\@fluentui\react-icons")
if ($needsInstall) {
    Write-Host "Instaliram ili osvežavam zavisnosti..." -ForegroundColor Yellow
    npm install --no-audit --no-fund
}

Write-Host "Proveravam TypeScript/Vite build..." -ForegroundColor Yellow
npm run build

$Url = "http://localhost:5600"
Write-Host "Pokrećem ERS Studio na $Url" -ForegroundColor Green

$browserJob = Start-Job -ScriptBlock {
    param($TargetUrl)
    Start-Sleep -Seconds 2
    Start-Process $TargetUrl
} -ArgumentList $Url

try {
    npm run dev -- --host 127.0.0.1 --port 5600
}
finally {
    Remove-Job $browserJob -Force -ErrorAction SilentlyContinue
}
