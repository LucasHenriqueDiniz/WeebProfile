export default function toBoolean(value: string | undefined | boolean): boolean {
  if (!value) return false
  if (value === true) return true
  return value?.toLocaleLowerCase().trim() === "true"
}
