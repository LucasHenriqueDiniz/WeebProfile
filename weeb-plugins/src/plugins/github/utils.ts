/**
 * Utilitários do plugin GitHub
 */

// Paleta padronizada de cores do GitHub para diferentes níveis de contribuição
// Normalizadas para funcionar bem tanto em temas dark quanto light usando opacidade
const GITHUB_CALENDAR_COLORS: Record<string, string> = {
  // Vazio (sem contribuições)
  '#ebedf0': 'rgba(128, 128, 128, 0.25)',
  'rgb(235, 237, 240)': 'rgba(128, 128, 128, 0.25)',
  'rgb(235,237,240)': 'rgba(128, 128, 128, 0.25)',
  
  // Nível 1 (1-3 contribuições) - Verde muito claro
  '#9be9a8': 'rgba(40, 167, 69, 0.4)',
  'rgb(155, 233, 168)': 'rgba(40, 167, 69, 0.4)',
  'rgb(155,233,168)': 'rgba(40, 167, 69, 0.4)',
  
  // Nível 2 (4-9 contribuições) - Verde claro
  '#40c463': 'rgba(40, 167, 69, 0.6)',
  'rgb(64, 196, 99)': 'rgba(40, 167, 69, 0.6)',
  'rgb(64,196,99)': 'rgba(40, 167, 69, 0.6)',
  
  // Nível 3 (10-19 contribuições) - Verde médio
  '#30a14e': 'rgba(40, 167, 69, 0.8)',
  'rgb(48, 161, 78)': 'rgba(40, 167, 69, 0.8)',
  'rgb(48,161,78)': 'rgba(40, 167, 69, 0.8)',
  
  // Nível 4 (20+ contribuições) - Verde escuro
  '#216e39': 'rgba(40, 167, 69, 1)',
  'rgb(33, 110, 57)': 'rgba(40, 167, 69, 1)',
  'rgb(33,110,57)': 'rgba(40, 167, 69, 1)',
}

/**
 * Normaliza e padroniza cores do calendário do GitHub
 * Funciona bem tanto em temas dark quanto light usando opacidade
 * 
 * @param color - Cor original do GitHub (hex, rgb, etc)
 * @returns Cor normalizada com opacidade para funcionar em ambos os temas
 */
export function getCalendarColor(color: string | undefined): string {
  if (!color) return 'rgba(128, 128, 128, 0.25)'
  
  // Normalizar a cor para comparação (remover espaços, converter para minúsculas)
  const normalizedColor = color.trim().toLowerCase()
  
  // Verificar se temos uma cor padronizada
  if (GITHUB_CALENDAR_COLORS[normalizedColor]) {
    return GITHUB_CALENDAR_COLORS[normalizedColor]
  }
  
  // Verificar também com a cor original (pode ter espaços diferentes)
  if (GITHUB_CALENDAR_COLORS[color]) {
    return GITHUB_CALENDAR_COLORS[color]
  }
  
  // Se não encontrou uma cor padronizada, tentar detectar o nível pela cor
  // e aplicar uma opacidade baseada no brilho da cor
  try {
    // Converter hex para RGB se necessário
    let r: number, g: number, b: number
    
    if (normalizedColor.startsWith('#')) {
      const hex = normalizedColor.slice(1)
      r = parseInt(hex.slice(0, 2), 16)
      g = parseInt(hex.slice(2, 4), 16)
      b = parseInt(hex.slice(4, 6), 16)
    } else if (normalizedColor.startsWith('rgb')) {
      const match = normalizedColor.match(/\d+/g)
      if (match && match.length >= 3 && match[0] && match[1] && match[2]) {
        r = parseInt(match[0], 10)
        g = parseInt(match[1], 10)
        b = parseInt(match[2], 10)
      } else {
        return 'rgba(128, 128, 128, 0.25)'
      }
    } else {
      return 'rgba(128, 128, 128, 0.25)'
    }
    
    // Calcular brilho (luminância relativa)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    
    // Se for muito claro (provavelmente vazio), aplicar opacidade baixa
    if (brightness > 230) {
      return 'rgba(128, 128, 128, 0.25)'
    }
    
    // Para cores verdes (típicas do GitHub), usar verde padronizado com opacidade baseada no brilho
    // Verde mais escuro = mais opaco
    const opacity = Math.max(0.4, Math.min(1, (255 - brightness) / 200))
    return `rgba(40, 167, 69, ${opacity.toFixed(2)})`
  } catch {
    // Fallback para cor vazia se houver erro
    return 'rgba(128, 128, 128, 0.25)'
  }
}




