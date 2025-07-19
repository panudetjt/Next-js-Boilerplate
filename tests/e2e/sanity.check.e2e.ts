import { expect, test } from '@playwright/test';

// Checkly is a tool used to monitor deployed environments, such as production or preview environments.
// It runs end-to-end tests with the `.check.e2e.ts` extension after each deployment to ensure that the environment is up and running.
// With Checkly, you can monitor your production environment and run `*.check.e2e.ts` tests regularly at a frequency of your choice.
// If the tests fail, Checkly will notify you via email, Slack, or other channels of your choice.
// On the other hand, E2E tests ending with `*.e2e.ts` are only run before deployment.
// You can run them locally or on CI to ensure that the application is ready for deployment.

// BaseURL needs to be explicitly defined in the test file.
// Otherwise, Checkly runtime will throw an exception: `CHECKLY_INVALID_URL: Only URL's that start with http(s)`
// You can't use `goto` function directly with a relative path like with other *.e2e.ts tests.
// Check the example at https://feedback.checklyhq.com/changelog/new-changelog-436

test.describe('Sanity', () => {
  test.describe('Static pages', () => {
    test('should display the homepage', async ({ page, baseURL }) => {
      // Arrange
      const homepageUrl = `${baseURL}/`;
      const expectedHeading = 'Boilerplate Code for Your Next.js Project with Tailwind CSS';

      // Act
      await page.goto(homepageUrl);

      // Assert
      await expect(
        page.getByRole('heading', { name: expectedHeading }),
      ).toBeVisible();
    });

    test('should navigate to the about page', async ({ page, baseURL }) => {
      // Arrange
      const homepageUrl = `${baseURL}/`;
      const aboutLinkName = 'About';
      const expectedUrl = /about$/;
      const expectedText = 'Welcome to our About page';

      // Act
      await page.goto(homepageUrl);
      await page.getByRole('link', { name: aboutLinkName }).click();

      // Assert
      await expect(page).toHaveURL(expectedUrl);
      await expect(
        page.getByText(expectedText, { exact: false }),
      ).toBeVisible();
    });

    test('should navigate to the portfolio page', async ({ page, baseURL }) => {
      // Arrange
      const homepageUrl = `${baseURL}/`;
      const portfolioLinkName = 'Portfolio';
      const expectedUrl = /portfolio$/;
      const expectedPortfolioLinksCount = 6;

      // Act
      await page.goto(homepageUrl);
      await page.getByRole('link', { name: portfolioLinkName }).click();

      // Assert
      await expect(page).toHaveURL(expectedUrl);
      await expect(
        page.locator('main').getByRole('link', { name: /^Portfolio/ }),
      ).toHaveCount(expectedPortfolioLinksCount);
    });
  });
});
