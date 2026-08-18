import { describe, expect, it } from 'vitest';
import { formatVisibleWhitespace, generateAbbreviation } from './util';

describe('util methods', () => {
  describe('generateAbbreviation', () => {
    it('should return empty string for falsy labels', () => {
      expect(generateAbbreviation('')).toEqual('');
    });

    it('should return the word itself for single words', () => {
      expect(generateAbbreviation('Assessment')).toEqual('Assessment');
      expect(generateAbbreviation('Questionnaire')).toEqual('Questionnaire');
      expect(generateAbbreviation('Scale')).toEqual('Scale');
    });

    it('should return first letters of all words for multi-word labels', () => {
      expect(generateAbbreviation('Robson Ten Group Classification System')).toEqual('RTGCS');
      expect(generateAbbreviation('Malnutrition Screening Tool')).toEqual('MST');
      expect(generateAbbreviation('Minnesota Living with Heart Failure Questionnaire')).toEqual(
        'MLWHFQ'
      );
    });

    it('should handle underscores and hyphens as delimiters', () => {
      expect(generateAbbreviation('Postpartum-Bonding-Questionnaire')).toEqual('PBQ');
      expect(generateAbbreviation('Monkeypox_severity_scale')).toEqual('MSS');
    });
  });

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
