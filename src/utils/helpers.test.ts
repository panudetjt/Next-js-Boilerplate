import { describe, expect, it } from 'vitest';
import { routing } from '@/libs/i18n-routing';
import { getI18nPath } from './helpers';

describe('Helpers', () => {
  describe('getI18nPath function', () => {
    it('should not change the path for default language', () => {
      // Arrange
      const url = '/random-url';
      const locale = routing.defaultLocale;

      // Act
      const result = getI18nPath(url, locale);

      // Assert
      expect(result).toBe(url);
    });

    it('should prepend the locale to the path for non-default language', () => {
      // Arrange
      const url = '/random-url';
      const locale = 'fr';
      const expectedPattern = /^\/fr/;

      // Act
      const result = getI18nPath(url, locale);

      // Assert
      expect(result).toMatch(expectedPattern);
    });
  });
});
