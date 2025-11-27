#!/bin/bash

# Script de teste rápido para o servidor local

echo "🧪 Testando SVG Generator local..."
echo ""

# Verificar se servidor está rodando
if ! curl -s http://localhost:3001 > /dev/null 2>&1; then
  echo "❌ Servidor não está rodando em http://localhost:3001"
  echo "💡 Execute: cd svg-generator && pnpm dev:server"
  exit 1
fi

echo "✅ Servidor está rodando"
echo ""

# Teste básico
echo "📝 Teste 1: Geração básica (GitHub profile)"
RESPONSE=$(curl -s -X POST http://localhost:3001 \
  -H "Content-Type: application/json" \
  -d '{
    "style": "default",
    "size": "half",
    "plugins": {
      "github": {
        "enabled": true,
        "username": "octocat",
        "sections": ["profile"]
      }
    }
  }')

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ Teste 1 passou"
  SVG_LENGTH=$(echo "$RESPONSE" | jq -r '.svg' | wc -c)
  WIDTH=$(echo "$RESPONSE" | jq -r '.width')
  HEIGHT=$(echo "$RESPONSE" | jq -r '.height')
  echo "   SVG gerado: ${SVG_LENGTH} caracteres"
  echo "   Dimensões: ${WIDTH}x${HEIGHT}"
else
  echo "❌ Teste 1 falhou"
  echo "$RESPONSE" | jq .
  exit 1
fi

echo ""
echo "📝 Teste 2: Múltiplos plugins"
RESPONSE2=$(curl -s -X POST http://localhost:3001 \
  -H "Content-Type: application/json" \
  -d '{
    "style": "default",
    "size": "half",
    "plugins": {
      "github": {
        "enabled": true,
        "username": "octocat",
        "sections": ["profile"]
      },
      "lastfm": {
        "enabled": true,
        "sections": ["recent_tracks"]
      }
    },
    "pluginsOrder": ["github", "lastfm"]
  }')

if echo "$RESPONSE2" | grep -q '"success":true'; then
  echo "✅ Teste 2 passou"
  SVG_LENGTH2=$(echo "$RESPONSE2" | jq -r '.svg' | wc -c)
  WIDTH2=$(echo "$RESPONSE2" | jq -r '.width')
  HEIGHT2=$(echo "$RESPONSE2" | jq -r '.height')
  echo "   SVG gerado: ${SVG_LENGTH2} caracteres"
  echo "   Dimensões: ${WIDTH2}x${HEIGHT2}"
else
  echo "❌ Teste 2 falhou"
  echo "$RESPONSE2" | jq .
  exit 1
fi

echo ""
echo "✅ Todos os testes passaram!"


