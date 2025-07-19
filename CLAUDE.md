# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 IMPORTANT WORKFLOW GUIDELINES

### Task Planning Protocol
**ALWAYS follow this workflow for any task:**

1. **Plan First**: Create or update `ai/project-plan.md` with:
   - Clear objective and implementation steps
   - Success criteria and context updates needed
   - Use the provided template in the file

2. **Implement**: Execute the planned tasks systematically

3. **Update Context**: After completion, update this CLAUDE.md file to:
   - Add new commands or workflows discovered
   - Document architecture changes or new patterns
   - Preserve important context for future Claude sessions
   - **This prevents context loss between sessions**

### Project Planning Location
- **File**: `ai/project-plan.md`
- **Purpose**: Pre-implementation planning and context documentation
- **Template**: Available in the file for consistent planning structure

## Essential Commands

### Development
- `npm run dev` - Start development server with database and Next.js (uses turbopack and PGlite local database)
- `npm run dev:next` - Start Next.js dev server only with turbopack
- `npm run dev:spotlight` - Start Sentry Spotlight for local error monitoring

### Building and Production
- `npm run build` - Production build with memory database (runs in parallel)
- `npm run build:next` - Build Next.js only
- `npm run start` - Start production server
- `npm run build-stats` - Build with bundle analyzer

### Testing
- `npm run test` - Run unit tests with Vitest
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run storybook:test` - Run Storybook tests in headless mode
- `npx playwright install` - Install Playwright browsers (first time setup)

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run check:types` - TypeScript type checking
- `npm run check:deps` - Check for unused dependencies with Knip
- `npm run check:i18n` - Validate i18n translations

### Database
- `npm run db:generate` - Generate Drizzle migration from schema changes
- `npm run db:studio` - Open Drizzle Studio at https://local.drizzle.studio
- `npm run db-server:file` - Start PGlite server with file persistence
- `npm run db-server:memory` - Start PGlite server in memory

### Development Tools
- `npm run storybook` - Start Storybook on port 6006
- `npm run commit` - Interactive commit with Commitizen
- `npm run lighthouse` - Run Lighthouse audit
- `npm run test:lighthouse` - Run app and Lighthouse together

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15+ with App Router and React 19
- **Styling**: Tailwind CSS 4
- **Database**: DrizzleORM with PostgreSQL (PGlite for local development)
- **Authentication**: Clerk with multi-factor auth, social logins, passwordless
- **Internationalization**: next-intl with Crowdin integration
- **Testing**: Vitest (unit), Playwright (E2E), Storybook
- **Security**: Arcjet (bot protection, rate limiting, WAF)
- **Monitoring**: Sentry, PostHog analytics, Better Stack logging
- **Type Safety**: TypeScript, Zod validation, T3 Env

### Project Structure
- `ai/` - Project planning and context documentation
- `ai/project-plan.md` - Task planning template and current plans
- `scripts/` - Build and utility scripts (with co-located tests)
- `src/app/[locale]/` - Next.js App Router with internationalization
- `src/components/` - Reusable React components
- `src/libs/` - Third-party library configurations and utilities
- `src/models/schema.ts` - Drizzle database schema definitions
- `src/locales/` - i18n translation files (en.json, fr.json)
- `src/utils/` - Utility functions and app configuration
- `src/validations/` - Zod validation schemas
- `src/templates/` - Page templates and layouts
- `tests/e2e/` - Playwright E2E tests
- `tests/integration/` - Integration tests
- `migrations/` - Database migration files

### Key Configuration Files
- `next.config.ts` - Next.js config with Sentry, bundle analyzer, i18n plugin
- `drizzle.config.ts` - Database ORM configuration pointing to schema.ts
- `vitest.config.mts` - Test configuration with colocation support for scripts/
- `src/libs/env.ts` - Type-safe environment variables with T3 Env and Zod
- `src/libs/i18n.ts` - Internationalization setup with next-intl
- `src/libs/arcjet.ts` - Security configuration (bot detection, WAF)

### Database Schema Management
- Schema defined in `src/models/schema.ts` using Drizzle ORM
- After schema changes, run `npm run db:generate` to create migrations
- Migrations are auto-applied on next database interaction
- Local development uses PGlite (no external database required)
- Production typically uses PostgreSQL (configured via DATABASE_URL)

### Authentication & Environment
- Uses Clerk for authentication (requires CLERK_SECRET_KEY and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
- Environment variables are type-safe via `src/libs/env.ts`
- Local development works out-of-the-box with PGlite database
- Optional services: Sentry (error monitoring), PostHog (analytics), Arcjet (security)

### Routing & i18n
- App Router with `[locale]` dynamic segment for internationalization
- Supported locales configured in `src/libs/i18n-routing.ts`
- Translation files in `src/locales/` directory
- Crowdin integration for automated translations

### Key Development Patterns
- **File Naming Convention**: All files use kebab-case naming (e.g., `counter-form.tsx`, `post-hog-provider.tsx`)
- **Test Colocation**: Test files are co-located with implementation files (tests next to code)
- **TDD Approach**: Write tests first, then implementation (especially for scripts and utilities)
- Components co-located with `.stories.tsx` (Storybook) and `.test.tsx` (tests)
- Validation schemas in `src/validations/` using Zod
- Environment variables strictly typed and validated
- Database migrations generated from schema changes, not manual SQL
- Error monitoring with Sentry Spotlight in development
- Form handling with React Hook Form + Zod validation

### Testing Strategy
- **Unit tests**: Vitest with browser mode and Node.js environment
- **Test Colocation**: Tests are placed next to implementation files
- **TDD Support**: Framework supports test-driven development workflow
- **Script Testing**: Custom scripts in `scripts/` directory have co-located tests
- **Code Coverage**: Target 95%+ coverage for custom scripts and utilities
- **Coverage Commands**: `npm run test -- --coverage` for coverage reports
- **Integration tests**: Playwright (`.spec.ts` files)
- **E2E tests**: Playwright (`.e2e.ts` files)
- **Component testing**: Storybook with accessibility testing
- **Visual regression testing** supported

### Test Structure Guidelines (AAA Pattern)
All test files follow the **Arrange, Act, Assert (AAA)** principle with clear step comments:

- **Arrange**: Set up test data, mocks, and initial conditions
- **Act**: Execute the code being tested
- **Assert**: Verify the expected outcomes

**Pattern Example:**
```typescript
it('should increment counter correctly', () => {
  // Arrange
  const initialValue = 0;
  const incrementAmount = 5;

  // Act
  const result = increment(initialValue, incrementAmount);

  // Assert
  expect(result).toBe(5);
});
```

**Key Guidelines:**
- Each step must have a clear comment (`// Arrange`, `// Act`, `// Assert`)
- Don't combine steps - keep them separate for clarity
- Extract test data into variables in the Arrange section
- Use descriptive variable names that explain the test scenario
- For tests with multiple act/assert cycles, repeat the pattern clearly
- Preserve existing comments while adding AAA structure

### Scripts and Utilities
- `scripts/rename-files.ts` - File renaming utility with TDD approach (95.83% coverage)
- Scripts follow kebab-case naming convention
- All scripts have co-located test files using Vitest
- vitest.config.mts configured to support testing in scripts/ directory
- Coverage includes scripts directory in addition to src/
- Test scripts comprehensively with mocking for file system operations
