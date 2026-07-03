import { describe, it, expect } from 'vitest';
import { calculateMood } from './pet-mood';

describe('calculateMood', () => {
  it('retorna happy si streak >= 3 y dailyProgress > 0', () => {
    expect(calculateMood(3, 1)).toBe('happy');
    expect(calculateMood(5, 3)).toBe('happy');
    expect(calculateMood(10, 1)).toBe('happy');
  });

  it('retorna sad si streak es 0 y dailyProgress es 0', () => {
    expect(calculateMood(0, 0)).toBe('sad');
  });

  it('retorna neutral si streak > 0 pero dailyProgress es 0', () => {
    expect(calculateMood(1, 0)).toBe('neutral');
    expect(calculateMood(3, 0)).toBe('neutral');
    expect(calculateMood(7, 0)).toBe('neutral');
  });

  it('retorna neutral si streak es 0 pero dailyProgress > 0', () => {
    expect(calculateMood(0, 1)).toBe('neutral');
    expect(calculateMood(0, 5)).toBe('neutral');
  });

  it('retorna neutral si streak < 3 y dailyProgress > 0', () => {
    expect(calculateMood(1, 1)).toBe('neutral');
    expect(calculateMood(2, 2)).toBe('neutral');
  });

  it('retorna neutral si streak < 3 y dailyProgress es 0', () => {
    expect(calculateMood(1, 0)).toBe('neutral');
    expect(calculateMood(2, 0)).toBe('neutral');
  });
});
