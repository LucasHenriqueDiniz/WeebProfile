/**
 * SVG Width Calculator
 * 
 * Calcula a largura do SVG baseado no tamanho.
 * 
 * NOTA: A altura agora é calculada dinamicamente usando Playwright
 * (veja src/layout/measure-height.ts). Este arquivo mantém apenas
 * a função de cálculo de largura que ainda é necessária.
 */

/**
 * Calcula a largura do SVG baseado no tamanho
 */
export function calculateSvgWidth(size: 'half' | 'full'): number {
  return size === 'half' ? 415 : 830
}

