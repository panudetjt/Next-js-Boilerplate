import * as fs from 'node:fs';
import * as path from 'node:path';
import { glob } from 'glob';

export type RenameMapping = {
  oldPath: string;
  newPath: string;
  oldName: string;
  newName: string;
};

/**
 * Convert PascalCase string to kebab-case
 */
export function pascalToKebabCase(input: string): string {
  // Handle file extensions
  const parts = input.split('.');
  const nameOnly = parts[0];
  const extensions = parts.slice(1);

  if (!nameOnly) {
    return input;
  }

  // Check if already kebab-case (contains hyphens or all lowercase)
  if (nameOnly.includes('-') || nameOnly === nameOnly.toLowerCase()) {
    return input;
  }

  // Convert PascalCase to kebab-case
  const kebabName = nameOnly
    // Handle special cases like "PostHog" -> "posthog" (consecutive caps that should stay together)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    // Convert to lowercase
    .toLowerCase();

  // Rejoin with extensions
  return extensions.length > 0 ? `${kebabName}.${extensions.join('.')}` : kebabName;
}

/**
 * Check if a filename is in PascalCase format
 */
function isPascalCase(filename: string): boolean {
  const nameOnly = path.basename(filename).split('.')[0];

  if (!nameOnly) {
    return false;
  }

  // Skip if already kebab-case
  if (nameOnly.includes('-') || nameOnly === nameOnly.toLowerCase()) {
    return false;
  }

  // Check if starts with uppercase and contains at least one uppercase letter
  return /^[A-Z]/.test(nameOnly) && /[A-Z]/.test(nameOnly);
}

/**
 * Find all PascalCase files in given file list
 */
export function findPascalCaseFiles(files: string[]): string[] {
  return files.filter((file) => {
    const filename = path.basename(file);
    return isPascalCase(filename);
  });
}

/**
 * Create mapping of old paths to new paths for renaming
 */
export function createRenameMapping(pascalFiles: string[]): RenameMapping[] {
  return pascalFiles.map((oldPath) => {
    const dir = path.dirname(oldPath);
    const oldName = path.basename(oldPath);
    const newName = pascalToKebabCase(oldName);
    const newPath = path.join(dir, newName);

    return {
      oldPath,
      newPath,
      oldName,
      newName,
    };
  });
}

/**
 * Update import statements in file content based on rename mapping
 */
export function updateImportStatements(content: string, renameMapping: RenameMapping[]): string {
  let updatedContent = content;

  renameMapping.forEach((mapping) => {
    const { oldName, newName } = mapping;
    const oldNameWithoutExt = path.basename(oldName, path.extname(oldName));
    const newNameWithoutExt = path.basename(newName, path.extname(newName));

    // Update absolute imports (@/ prefix)
    const absoluteImportRegex = new RegExp(
      `(from\\s+['"]@/[^'"]*/)${oldNameWithoutExt}(['"])`,
      'g',
    );
    updatedContent = updatedContent.replace(absoluteImportRegex, `$1${newNameWithoutExt}$2`);

    // Update relative imports (./ and ../ prefix)
    const relativeImportRegex = new RegExp(
      `(from\\s+['"](?:\\./|\\.\\./[^'"]*/)?)${oldNameWithoutExt}(['"])`,
      'g',
    );
    updatedContent = updatedContent.replace(relativeImportRegex, `$1${newNameWithoutExt}$2`);
  });

  return updatedContent;
}

/**
 * Scan directory for all TypeScript/JavaScript files
 */
async function scanForFiles(directories: string[]): Promise<string[]> {
  const patterns = directories.map(dir => `${dir}/**/*.{ts,tsx,js,jsx}`);
  const allFiles: string[] = [];

  for (const pattern of patterns) {
    const files = await glob(pattern, { ignore: ['**/node_modules/**'] });
    allFiles.push(...files);
  }

  return allFiles;
}

/**
 * Update all import statements in project files
 */
async function updateAllImports(renameMapping: RenameMapping[]): Promise<void> {
  const directories = ['src', 'tests'];
  const allFiles = await scanForFiles(directories);

  console.log(`Updating imports in ${allFiles.length} files...`);

  for (const filePath of allFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const updatedContent = updateImportStatements(content, renameMapping);

      if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Updated imports in: ${filePath}`);
      }
    } catch (error) {
      console.warn(`Warning: Could not update ${filePath}:`, error);
    }
  }
}

/**
 * Main function to rename all PascalCase files to kebab-case
 */
export async function renameAllFiles(dryRun = false): Promise<RenameMapping[]> {
  const directories = ['src', 'tests'];
  console.log('Scanning for PascalCase files...');

  // Find all files in target directories
  const allFiles = await scanForFiles(directories);
  console.log(`Found ${allFiles.length} total files`);

  // Filter for PascalCase files
  const pascalFiles = findPascalCaseFiles(allFiles);
  console.log(`Found ${pascalFiles.length} PascalCase files to rename`);

  if (pascalFiles.length === 0) {
    console.log('No PascalCase files found to rename.');
    return [];
  }

  // Create rename mapping
  const renameMapping = createRenameMapping(pascalFiles);

  if (dryRun) {
    console.log('\\n=== DRY RUN - Files that would be renamed ===');
    renameMapping.forEach((mapping) => {
      console.log(`${mapping.oldPath} -> ${mapping.newPath}`);
    });
    return renameMapping;
  }

  console.log('\\n=== Renaming files ===');

  // Rename files using git mv to preserve history
  for (const mapping of renameMapping) {
    try {
      // Use git mv if in a git repository, otherwise use fs.rename
      const { execSync } = await import('node:child_process');
      try {
        execSync(`git mv "${mapping.oldPath}" "${mapping.newPath}"`, { stdio: 'pipe' });
        console.log(`✓ Renamed: ${mapping.oldPath} -> ${mapping.newPath}`);
      } catch {
        // Fallback to regular file system rename
        fs.renameSync(mapping.oldPath, mapping.newPath);
        console.log(`✓ Renamed: ${mapping.oldPath} -> ${mapping.newPath}`);
      }
    } catch (error) {
      console.error(`✗ Failed to rename ${mapping.oldPath}:`, error);
    }
  }

  // Update all import statements
  console.log('\\n=== Updating import statements ===');
  await updateAllImports(renameMapping);

  console.log('\\n✅ File renaming completed!');
  console.log('\\n📋 Summary:');
  console.log(`- Renamed ${renameMapping.length} files`);
  console.log('- Updated import statements in all project files');
  console.log('\\n🔧 Next steps:');
  console.log('- Run npm run check:types to verify no broken references');
  console.log('- Run npm run lint to check code style');
  console.log('- Run npm run test to ensure tests still pass');

  return renameMapping;
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  renameAllFiles(dryRun).catch(console.error);
}
