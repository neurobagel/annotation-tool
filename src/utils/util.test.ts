import { describe, expect, it } from 'vitest';
import { formatVisibleWhitespace } from './util';

describe('util methods', () => {
  describe('formatVisibleWhitespace', () => {
    it('should replace spaces with middle dots', () => {
      expect(formatVisibleWhitespace('hello world ')).toBe('hello·world·');
    });

    it('should replace tabs with arrows', () => {
      expect(formatVisibleWhitespace('data\tpoint')).toBe('data→point');
    });

    it('should replace newlines with pilcrow plus newline', () => {
      expect(formatVisibleWhitespace('line1\nline2')).toBe('line1¶\nline2');
    });

    it('should replace carriage returns with currency sign', () => {
      expect(formatVisibleWhitespace('windows\r\n')).toBe('windows¤¶\n');
    });
  });
});
