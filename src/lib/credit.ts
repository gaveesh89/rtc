/** Share of each rent payment recorded as purchase credit. */
export const CREDIT_RATE = 0.1;

/** Credit stops growing after this many years. */
export const CREDIT_CAP_YEARS = 5;

/** Upper bound accepted by the calculator, to keep inputs sane. */
export const MAX_MONTHLY_RENT = 20_000;

/** Clamp a raw input to a valid monthly rent in pounds. */
export function sanitiseRent(raw: unknown): number {
  const value = typeof raw === 'number' ? raw : Number.parseFloat(String(raw));
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(value, MAX_MONTHLY_RENT);
}

/**
 * Credit built up after `years` of paying `monthlyRent`, assuming rent stays level.
 * Growth stops at CREDIT_CAP_YEARS.
 */
export function creditAfterYears(monthlyRent: number, years: number): number {
  const rent = sanitiseRent(monthlyRent);
  const counted = Math.max(0, Math.min(years, CREDIT_CAP_YEARS));
  return rent * 12 * counted * CREDIT_RATE;
}

const gbpFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

/** Format a pound amount, rounded to whole pounds, e.g. "£1,800". */
export function formatGBP(amount: number): string {
  return gbpFormatter.format(Math.round(amount));
}
