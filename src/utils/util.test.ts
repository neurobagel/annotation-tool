import { describe, expect, it } from 'vitest';
import { generateAbbreviation } from './util';

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
});
