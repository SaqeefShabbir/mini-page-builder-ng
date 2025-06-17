export type SafeNumber = number | null;

export function toSafeNumber(value: unknown, defaultValue: number = 0): SafeNumber {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}