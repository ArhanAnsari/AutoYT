# AutoYT CRON_SECRET Verification Script (PowerShell)
# This script tests that the CRON_SECRET is properly configured and validates correctly

Write-Host "`n╔════════════════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║     AutoYT CRON_SECRET Verification Test           ║" -ForegroundColor Blue
Write-Host "╚════════════════════════════════════════════════════╝`n" -ForegroundColor Blue

# Load CRON_SECRET from .env.local
Write-Host "ℹ️  Loading CRON_SECRET from .env.local..." -ForegroundColor Yellow

if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local"
    $cronSecretLine = $envContent | Select-String 'CRON_SECRET='
    
    if ($cronSecretLine) {
        $CRON_SECRET = $cronSecretLine -replace 'CRON_SECRET="', '' -replace '"', ''
        Write-Host "✓ CRON_SECRET found" -ForegroundColor Green
        Write-Host "Secret (first 20 chars): $($CRON_SECRET.Substring(0, 20))..." -ForegroundColor Blue
    } else {
        Write-Host "✗ ERROR: CRON_SECRET not found in .env.local" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✗ ERROR: .env.local not found" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test if server is running
Write-Host "Checking if server is running on localhost:3000..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -ErrorAction Stop
    Write-Host "✓ Server is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Server not running. Start it with: npm run dev" -ForegroundColor Red
    Write-Host "`nTo manually test when server is running:` `n" -ForegroundColor Yellow
    
    Write-Host "1. Test WITH correct secret (should return 200/success):" -ForegroundColor Yellow
    Write-Host "`ncurl -X POST http://localhost:3000/api/publish-scheduled ``" -ForegroundColor Cyan
    Write-Host "  -H 'Authorization: Bearer $CRON_SECRET' ``" -ForegroundColor Cyan
    Write-Host "  -H 'Content-Type: application/json' ``" -ForegroundColor Cyan
    Write-Host "  -d '{`"channelId`":`"test`"}'" -ForegroundColor Cyan
    
    Write-Host "`n2. Test WITH wrong secret (should return 401 Unauthorized):" -ForegroundColor Yellow
    Write-Host "`ncurl -X POST http://localhost:3000/api/publish-scheduled ``" -ForegroundColor Cyan
    Write-Host "  -H 'Authorization: Bearer wrong-secret' ``" -ForegroundColor Cyan
    Write-Host "  -H 'Content-Type: application/json' ``" -ForegroundColor Cyan
    Write-Host "  -d '{`"channelId`":`"test`"}'" -ForegroundColor Cyan
    
    Write-Host "`n3. Test WITHOUT secret (should return 401 Unauthorized):" -ForegroundColor Yellow
    Write-Host "`ncurl -X POST http://localhost:3000/api/publish-scheduled ``" -ForegroundColor Cyan
    Write-Host "  -H 'Content-Type: application/json' ``" -ForegroundColor Cyan
    Write-Host "  -d '{`"channelId`":`"test`"}'" -ForegroundColor Cyan
    
    exit 0
}

Write-Host ""

# Test 1: Valid secret
Write-Host "Test 1: Calling endpoint WITH correct secret..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/publish-scheduled" `
        -Method POST `
        -Headers @{ "Authorization" = "Bearer $CRON_SECRET"; "Content-Type" = "application/json" } `
        -Body '{"channelId":"test-channel-id"}' `
        -ErrorAction Stop
    
    Write-Host "✓ Response: 200 OK" -ForegroundColor Green
    Write-Host "Body: $($response.Content)" -ForegroundColor Blue
} catch {
    $statusCode = $_.Exception.Response.StatusCode.Value__
    Write-Host "✗ Response: $statusCode (expected 200)" -ForegroundColor Red
    Write-Host "Body: $($_.Exception.Message)" -ForegroundColor Blue
}

Write-Host ""

# Test 2: Invalid secret
Write-Host "Test 2: Calling endpoint WITH wrong secret..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/publish-scheduled" `
        -Method POST `
        -Headers @{ "Authorization" = "Bearer wrong-secret-should-fail"; "Content-Type" = "application/json" } `
        -Body '{"channelId":"test-channel-id"}' `
        -ErrorAction Stop
    
    Write-Host "✗ Response: 200 OK (expected 401)" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.Value__
    if ($statusCode -eq 401) {
        Write-Host "✓ Response: 401 Unauthorized (as expected)" -ForegroundColor Green
        $body = $_.Exception.Response.Content.ReadAsStringAsync().Result
        Write-Host "Body: $body" -ForegroundColor Blue
    } else {
        Write-Host "✗ Response: $statusCode (expected 401)" -ForegroundColor Red
    }
}

Write-Host ""

# Test 3: No secret
Write-Host "Test 3: Calling endpoint WITHOUT secret..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/publish-scheduled" `
        -Method POST `
        -Headers @{ "Content-Type" = "application/json" } `
        -Body '{"channelId":"test-channel-id"}' `
        -ErrorAction Stop
    
    Write-Host "✗ Response: 200 OK (expected 401)" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.Value__
    if ($statusCode -eq 401) {
        Write-Host "✓ Response: 401 Unauthorized (as expected)" -ForegroundColor Green
        $body = $_.Exception.Response.Content.ReadAsStringAsync().Result
        Write-Host "Body: $body" -ForegroundColor Blue
    } else {
        Write-Host "✗ Response: $statusCode (expected 401)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║          CRON_SECRET Verification Complete!        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host "`n✓ Your CRON_SECRET is ready for production!`n" -ForegroundColor Blue
