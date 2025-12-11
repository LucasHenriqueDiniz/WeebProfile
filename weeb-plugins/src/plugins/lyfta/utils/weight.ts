/**
 * Utility functions for weight formatting in Lyfta plugin
 */

/**
 * Converte gramas para a unidade desejada
 * @param grams - Peso em gramas
 * @param unit - Unidade desejada ('kg' ou 'lbs')
 * @returns Peso formatado na unidade desejada
 */
export function formatWeight(grams: number, unit: 'kg' | 'lbs' = 'kg'): string {
  if (unit === 'lbs') {
    // Converter gramas para libras (1 kg = 2.20462 lbs, 1 kg = 1000g)
    const pounds = (grams / 1000) * 2.20462
    if (pounds >= 1) {
      return `${pounds.toFixed(2)}lbs`
    }
    // Se for menos de 1 libra, mostrar em onças (1 lb = 16 oz)
    const ounces = pounds * 16
    return `${ounces.toFixed(1)}oz`
  }
  
  // Unidade padrão: kg
  if (grams >= 1000) {
    const kg = grams / 1000
    // Mostrar 2 casas decimais se necessário, senão 1
    const formatted = kg % 1 === 0 ? kg.toFixed(0) : kg.toFixed(2)
    return `${formatted}kg`
  }
  return `${grams}g`
}

