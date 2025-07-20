import type { RenameMapping } from './rename-files';
import * as fs from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createRenameMapping,
  findPascalCaseFiles,
  pascalToKebabCase,
  renameAllFiles,

  updateImportStatements,
} from './rename-files';

// Mock external dependencies
vi.mock('node:fs');
vi.mock('glob');

describe('File Renaming Utilities', () => {
  describe('pascalToKebabCase', () => {
    it('should convert PascalCase to kebab-case', () => {
      // Arrange
      const testCases = [
        { input: 'CounterForm', expected: 'counter-form' },
        { input: 'DemoBadge', expected: 'demo-badge' },
        { input: 'PostHogProvider', expected: 'post-hog-provider' },
        { input: 'I18nNavigation', expected: 'i18n-navigation' },
        { input: 'AppConfig', expected: 'app-config' },
      ];

      // Act & Assert
      testCases.forEach(({ input, expected }) => {
        expect(pascalToKebabCase(input)).toBe(expected);
      });
    });

    it('should handle single words', () => {
      // Arrange
      const testCases = [
        { input: 'Hello', expected: 'hello' },
        { input: 'Sponsors', expected: 'sponsors' },
      ];

      // Act & Assert
      testCases.forEach(({ input, expected }) => {
        expect(pascalToKebabCase(input)).toBe(expected);
      });
    });

    it('should handle consecutive uppercase letters', () => {
      // Arrange
      const testCases = [
        { input: 'I18n', expected: 'i18n' },
        { input: 'DB', expected: 'db' },
      ];

      // Act & Assert
      testCases.forEach(({ input, expected }) => {
        expect(pascalToKebabCase(input)).toBe(expected);
      });
    });

    it('should preserve file extensions', () => {
      // Arrange
      const testCases = [
        { input: 'CounterForm.tsx', expected: 'counter-form.tsx' },
        { input: 'BaseTemplate.stories.tsx', expected: 'base-template.stories.tsx' },
        { input: 'Helpers.test.ts', expected: 'helpers.test.ts' },
      ];

      // Act & Assert
      testCases.forEach(({ input, expected }) => {
        expect(pascalToKebabCase(input)).toBe(expected);
      });
    });

    it('should handle already kebab-case names', () => {
      // Arrange
      const testCases = [
        { input: 'already-kebab.ts', expected: 'already-kebab.ts' },
        { input: 'global.css', expected: 'global.css' },
      ];

      // Act & Assert
      testCases.forEach(({ input, expected }) => {
        expect(pascalToKebabCase(input)).toBe(expected);
      });
    });
  });

  describe('findPascalCaseFiles', () => {
    it('should identify PascalCase file names', () => {
      // Arrange
      const testFiles = [
        'src/components/CounterForm.tsx',
        'src/components/DemoBadge.tsx',
        'src/libs/I18n.ts',
        'src/utils/already-kebab.ts',
        'src/styles/global.css',
        'tests/e2e/Counter.e2e.ts',
      ];
      const expectedPascalFiles = [
        'src/components/CounterForm.tsx',
        'src/components/DemoBadge.tsx',
        'src/libs/I18n.ts',
        'tests/e2e/Counter.e2e.ts',
      ];

      // Act
      const result = findPascalCaseFiles(testFiles);

      // Assert
      expect(result).toEqual(expectedPascalFiles);
    });

    it('should exclude non-PascalCase files', () => {
      // Arrange
      const testFiles = [
        'src/middleware.ts',
        'src/instrumentation.ts',
        'src/app/layout.tsx',
        'package.json',
        '', // empty string
        '.', // just dot
      ];
      const expectedResult: any[] = [];

      // Act
      const result = findPascalCaseFiles(testFiles);

      // Assert
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createRenameMapping', () => {
    it('should create correct old->new path mappings', () => {
      // Arrange
      const pascalFiles = [
        'src/components/CounterForm.tsx',
        'src/libs/I18n.ts',
        'tests/e2e/Counter.e2e.ts',
      ];
      const expectedMappings = [
        {
          oldPath: 'src/components/CounterForm.tsx',
          newPath: 'src/components/counter-form.tsx',
          oldName: 'CounterForm.tsx',
          newName: 'counter-form.tsx',
        },
        {
          oldPath: 'src/libs/I18n.ts',
          newPath: 'src/libs/i18n.ts',
          oldName: 'I18n.ts',
          newName: 'i18n.ts',
        },
        {
          oldPath: 'tests/e2e/Counter.e2e.ts',
          newPath: 'tests/e2e/counter.e2e.ts',
          oldName: 'Counter.e2e.ts',
          newName: 'counter.e2e.ts',
        },
      ] satisfies RenameMapping[];

      // Act
      const result = createRenameMapping(pascalFiles);

      // Assert
      expect(result).toEqual(expectedMappings);
    });
  });

  describe('updateImportStatements', () => {
    it('should update import statements with new file names', () => {
      // Arrange
      const fileContent = `import { CounterForm } from '@/components/CounterForm';
import { DemoBadge } from '@/components/DemoBadge';
import { I18n } from '@/libs/I18n';`;
      const renameMapping = [
        { oldPath: 'src/components/CounterForm.tsx', newPath: 'src/components/counter-form.tsx', oldName: 'CounterForm.tsx', newName: 'counter-form.tsx' },
        { oldPath: 'src/components/DemoBadge.tsx', newPath: 'src/components/demo-badge.tsx', oldName: 'DemoBadge.tsx', newName: 'demo-badge.tsx' },
        { oldPath: 'src/libs/I18n.ts', newPath: 'src/libs/i18n.ts', oldName: 'I18n.ts', newName: 'i18n.ts' },
      ];
      const expectedResult = `import { CounterForm } from '@/components/counter-form';
import { DemoBadge } from '@/components/demo-badge';
import { I18n } from '@/libs/i18n';`;

      // Act
      const result = updateImportStatements(fileContent, renameMapping);

      // Assert
      expect(result).toBe(expectedResult);
    });

    it('should handle relative imports', () => {
      // Arrange
      const fileContent = `import { CounterForm } from './CounterForm';
import { BaseTemplate } from '../templates/BaseTemplate';`;
      const renameMapping = [
        { oldPath: 'src/components/CounterForm.tsx', newPath: 'src/components/counter-form.tsx', oldName: 'CounterForm.tsx', newName: 'counter-form.tsx' },
        { oldPath: 'src/templates/BaseTemplate.tsx', newPath: 'src/templates/base-template.tsx', oldName: 'BaseTemplate.tsx', newName: 'base-template.tsx' },
      ];
      const expectedResult = `import { CounterForm } from './counter-form';
import { BaseTemplate } from '../templates/base-template';`;

      // Act
      const result = updateImportStatements(fileContent, renameMapping);

      // Assert
      expect(result).toBe(expectedResult);
    });

    it('should preserve imports that do not need updating', () => {
      // Arrange
      const fileContent = `import React from 'react';
import { someFunction } from 'some-library';
import { AlreadyKebab } from './already-kebab';`;
      const renameMapping = [
        { oldPath: 'src/components/CounterForm.tsx', newPath: 'src/components/counter-form.tsx', oldName: 'CounterForm.tsx', newName: 'counter-form.tsx' },
      ];
      const expectedResult = fileContent; // Should remain unchanged

      // Act
      const result = updateImportStatements(fileContent, renameMapping);

      // Assert
      expect(result).toBe(expectedResult);
    });
  });

  describe('renameAllFiles', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();
      // Mock console methods to avoid test output pollution
      vi.spyOn(console, 'log').mockImplementation(() => {});
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should return empty array when no PascalCase files found', async () => {
      // Arrange
      const nonPascalFiles = [
        'src/middleware.ts',
        'src/app/layout.tsx',
        'tests/setup.ts',
      ];
      const { glob } = await import('glob');
      vi.mocked(glob).mockResolvedValue(nonPascalFiles);
      const expectedResult: any[] = [];

      // Act
      const result = await renameAllFiles(true);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('should identify and map PascalCase files in dry run mode', async () => {
      // Arrange
      const mixedFiles = [
        'src/components/CounterForm.tsx',
        'src/libs/I18n.ts',
        'tests/e2e/Counter.e2e.ts',
        'src/middleware.ts', // non-PascalCase file
      ];
      const expectedPascalFiles = ['CounterForm.tsx', 'I18n.ts', 'Counter.e2e.ts'];
      const expectedCounterFormMapping = {
        oldPath: 'src/components/CounterForm.tsx',
        newPath: 'src/components/counter-form.tsx',
        oldName: 'CounterForm.tsx',
        newName: 'counter-form.tsx',
      };
      const { glob } = await import('glob');
      vi.mocked(glob).mockResolvedValue(mixedFiles);

      // Act
      const result = await renameAllFiles(true);

      // Assert
      const matchedFiles = result.filter(mapping =>
        expectedPascalFiles.includes(mapping.oldName),
      );

      expect(matchedFiles.length).toBeGreaterThanOrEqual(3);

      const counterFormMapping = result.find(r => r.oldName === 'CounterForm.tsx');

      expect(counterFormMapping).toEqual(expectedCounterFormMapping);
    });

    it('should handle file system operations in non-dry-run mode', async () => {
      // Arrange
      const pascalFiles = ['src/components/CounterForm.tsx'];
      const mockFileContent = 'import React from "react";';
      const mockExecSync = vi.fn();
      const { glob } = await import('glob');
      vi.mocked(glob).mockResolvedValue(pascalFiles);
      vi.mocked(fs.readFileSync).mockReturnValue(mockFileContent);
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});
      vi.doMock('node:child_process', () => ({
        execSync: mockExecSync,
      }));

      // Act
      const result = await renameAllFiles(false);

      // Assert
      expect(result.length).toBeGreaterThanOrEqual(1);

      const counterFormMapping = result.find(r => r.oldName === 'CounterForm.tsx');

      expect(counterFormMapping).toBeDefined();
    });

    it('should fallback to fs.rename when git mv fails', async () => {
      // Arrange
      const pascalFiles = ['src/components/CounterForm.tsx'];
      const mockFileContent = 'import React from "react";';
      const gitMvError = new Error('git mv failed');
      const mockExecSync = vi.fn().mockImplementation(() => {
        throw gitMvError;
      });
      const { glob } = await import('glob');
      vi.mocked(glob).mockResolvedValue(pascalFiles);
      vi.mocked(fs.readFileSync).mockReturnValue(mockFileContent);
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});
      vi.mocked(fs.renameSync).mockImplementation(() => {});
      vi.doMock('node:child_process', () => ({
        execSync: mockExecSync,
      }));

      // Act
      const result = await renameAllFiles(false);

      // Assert
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(fs.renameSync).toHaveBeenCalled();
    });

    it('should handle file read errors gracefully', async () => {
      // Arrange
      const pascalFiles = [
        'src/components/CounterForm.tsx',
        'src/components/ErrorFile.tsx',
      ];
      const validFileContent = 'import React from "react";';
      const fileReadError = new Error('File read error');
      const mockExecSync = vi.fn();
      const { glob } = await import('glob');
      vi.mocked(glob).mockResolvedValue(pascalFiles);
      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(validFileContent)
        .mockImplementationOnce(() => {
          throw fileReadError;
        });
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});
      vi.doMock('node:child_process', () => ({
        execSync: mockExecSync,
      }));

      // Act
      const result = await renameAllFiles(false);

      // Assert
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(console.warn).toHaveBeenCalled();
    });

    it('should handle rename operation errors gracefully', async () => {
      // Arrange
      const pascalFiles = ['src/components/CounterForm.tsx'];
      const mockFileContent = 'import React from "react";';
      const gitMvError = new Error('git mv failed');
      const renameError = new Error('Rename failed');
      const mockExecSync = vi.fn().mockImplementation(() => {
        throw gitMvError;
      });
      const { glob } = await import('glob');
      vi.mocked(glob).mockResolvedValue(pascalFiles);
      vi.mocked(fs.readFileSync).mockReturnValue(mockFileContent);
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});
      vi.mocked(fs.renameSync).mockImplementation(() => {
        throw renameError;
      });
      vi.doMock('node:child_process', () => ({
        execSync: mockExecSync,
      }));

      // Act
      const result = await renameAllFiles(false);

      // Assert
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(console.error).toHaveBeenCalled();
    });

    it('should update file contents when imports need changing', async () => {
      // Arrange
      const pascalFiles = ['src/components/CounterForm.tsx'];
      const fileContentWithImports = 'import { Something } from "./CounterForm";';
      const mockExecSync = vi.fn();
      const { glob } = await import('glob');
      vi.mocked(glob).mockResolvedValue(pascalFiles);
      vi.mocked(fs.readFileSync).mockReturnValue(fileContentWithImports);
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});
      vi.doMock('node:child_process', () => ({
        execSync: mockExecSync,
      }));

      // Act
      await renameAllFiles(false);

      // Assert
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty filename gracefully', () => {
      // Arrange
      const testCases = [
        { input: '', expected: '' },
        { input: '.', expected: '.' },
        { input: '.tsx', expected: '.tsx' },
      ];

      // Act & Assert
      testCases.forEach(({ input, expected }) => {
        expect(pascalToKebabCase(input)).toBe(expected);
      });
    });

    it('should handle filenames with numbers', () => {
      // Arrange
      const testCases = [
        { input: 'Component2Form.tsx', expected: 'component2-form.tsx' },
        { input: 'I18nUtil.ts', expected: 'i18n-util.ts' },
      ];

      // Act & Assert
      testCases.forEach(({ input, expected }) => {
        expect(pascalToKebabCase(input)).toBe(expected);
      });
    });

    it('should preserve multiple extensions', () => {
      // Arrange
      const testCases = [
        { input: 'Component.test.tsx', expected: 'component.test.tsx' },
        { input: 'Template.stories.tsx', expected: 'template.stories.tsx' },
      ];

      // Act & Assert
      testCases.forEach(({ input, expected }) => {
        expect(pascalToKebabCase(input)).toBe(expected);
      });
    });
  });
});
