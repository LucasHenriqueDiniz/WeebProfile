export function convertToNumber(value: string | number): number {
  if (typeof value === "string") {
    const numericString = value.replace(/\D/g, "")
    return parseInt(numericString)
  }
  return value
}

export function abbreviateNumber(value: string | number): string {
  if (typeof value === "string") value = convertToNumber(value)

  if (value < 1e3) return value.toString()
  if (value >= 1e3 && value < 1e6) return +(value / 1e3).toFixed(1) + "K"
  if (value >= 1e6 && value < 1e9) return +(value / 1e6).toFixed(1) + "M"
  if (value >= 1e9 && value < 1e12) return +(value / 1e9).toFixed(1) + "B"
  if (value >= 1e12) return +(value / 1e12).toFixed(1) + "T"

  return value.toString()
}

/**
 * Formata o uso de disco em KB para uma representação legível
 * A API do GitHub retorna totalDiskUsage em KB (kilobytes)
 *
 * @param kilobytes - Valor em kilobytes (KB)
 * @returns String formatada (ex: "500 MB", "1.5 GB", "2 TB")
 */
export function formatDiskUsage(kilobytes: number): string {
  if (kilobytes < 1024) {
    return `${kilobytes} KB`
  }

  const megabytes = kilobytes / 1024
  if (megabytes < 1024) {
    return `${megabytes.toFixed(megabytes < 10 ? 1 : 0)} MB`
  }

  const gigabytes = megabytes / 1024
  if (gigabytes < 1024) {
    return `${gigabytes.toFixed(gigabytes < 10 ? 1 : 0)} GB`
  }

  const terabytes = gigabytes / 1024
  return `${terabytes.toFixed(terabytes < 10 ? 1 : 0)} TB`
}
