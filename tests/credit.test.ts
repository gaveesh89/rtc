import { describe, expect, it } from 'vitest';
import {
  CREDIT_CAP_YEARS,
  MAX_MONTHLY_RENT,
  creditAfterYears,
  formatGBP,
  sanitiseRent,
} from '../src/lib/credit';

describe('creditAfterYears', () => {
  it('records 10% of rent paid', () => {
    expect(creditAfterYears(1500, 1)).toBe(1800);
    expect(creditAfterYears(1500, 4)).toBe(7200);
  });

  it('stops growing after the cap', () => {
    const atCap = creditAfterYears(1500, CREDIT_CAP_YEARS);
    expect(creditAfterYears(1500, CREDIT_CAP_YEARS + 3)).toBe(atCap);
    expect(atCap).toBe(9000);
  });

  it('treats negative years as zero', () => {
    expect(creditAfterYears(1500, -2)).toBe(0);
  });
});

describe('sanitiseRent', () => {
  it.each([
    ['1500', 1500],
    [1250.5, 1250.5],
    ['', 0],
    ['abc', 0],
    [-50, 0],
    [Number.NaN, 0],
    [Number.POSITIVE_INFINITY, 0],
    [MAX_MONTHLY_RENT * 2, MAX_MONTHLY_RENT],
  ])('sanitiseRent(%s) -> %s', (input, expected) => {
    expect(sanitiseRent(input)).toBe(expected);
  });
});

describe('formatGBP', () => {
  it('formats whole pounds with separators', () => {
    expect(formatGBP(7200)).toBe('£7,200');
    expect(formatGBP(1234.6)).toBe('£1,235');
    expect(formatGBP(0)).toBe('£0');
  });
});
