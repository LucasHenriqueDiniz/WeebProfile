# Script de teste rápido para o servidor local (PowerShell)

Write-Host "🧪 Testando SVG Generator local..." -ForegroundColor Cyan
Write-Host ""

# Verificar se servidor está rodando
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -Method GET -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ Servidor está rodando" -ForegroundColor Green
} catch {
    Write-Host "❌ Servidor não está rodando em http://localhost:3001" -ForegroundColor Red
    Write-Host "💡 Execute: cd svg-generator && pnpm dev:server" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Teste básico
Write-Host "📝 Teste 1: Geração básica (GitHub profile)" -ForegroundColor Cyan
$body = @{
    style = "default"
    size = "half"
    plugins = @{
        github = @{
            enabled = $true
            username = "octocat"
            sections = @("profile")
        }
    }
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001" -Method POST -Body $body -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "✅ Teste 1 passou" -ForegroundColor Green
        $svgLength = $response.svg.Length
        Write-Host "   SVG gerado: $svgLength caracteres" -ForegroundColor Gray
        Write-Host "   Dimensões: $($response.width)x$($response.height)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Teste 1 falhou" -ForegroundColor Red
        $response | ConvertTo-Json
        exit 1
    }
} catch {
    Write-Host "❌ Teste 1 falhou: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 Teste 2: Múltiplos plugins" -ForegroundColor Cyan
$body2 = @{
    style = "default"
    size = "half"
    plugins = @{
        github = @{
            enabled = $true
            username = "octocat"
            sections = @("profile")
        }
        lastfm = @{
            enabled = $true
            sections = @("recent_tracks")
        }
    }
    pluginsOrder = @("github", "lastfm")
} | ConvertTo-Json -Depth 10

try {
    $response2 = Invoke-RestMethod -Uri "http://localhost:3001" -Method POST -Body $body2 -ContentType "application/json"
    
    if ($response2.success) {
        Write-Host "✅ Teste 2 passou" -ForegroundColor Green
        $svgLength2 = $response2.svg.Length
        Write-Host "   SVG gerado: $svgLength2 caracteres" -ForegroundColor Gray
        Write-Host "   Dimensões: $($response2.width)x$($response2.height)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Teste 2 falhou" -ForegroundColor Red
        $response2 | ConvertTo-Json
        exit 1
    }
} catch {
    Write-Host "❌ Teste 2 falhou: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Todos os testes passaram!" -ForegroundColor Green


