import { expect, takeSnapshot, test } from '@chromatic-com/playwright';

test.describe('Visual testing', () => {
  test.describe('Static pages', () => {
    test('should take screenshot of the homepage', async ({ page }, testInfo) => {
      // Arrange
      const expectedHeading = 'Boilerplate Code for Your Next.js Project with Tailwind CSS';

      // Act
      await page.goto('/');

      // Assert
      await expect(
        page.getByRole('heading', { name: expectedHeading }),
      ).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take screenshot of the portfolio page', async ({ page }, testInfo) => {
      // Arrange
      const expectedText = 'Welcome to my portfolio page!';

      // Act
      await page.goto('/portfolio');

      // Assert
      await expect(
        page.getByText(expectedText),
      ).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take screenshot of the about page', async ({ page }, testInfo) => {
      // Arrange
      const expectedText = 'Welcome to our About page!';

      // Act
      await page.goto('/about');

      // Assert
      await expect(
        page.getByText(expectedText),
      ).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take screenshot of the portfolio details page', async ({ page }, testInfo) => {
      // Arrange
      const portfolioId = '2';
      const expectedText = 'Created a set of promotional';

      // Act
      await page.goto(`/portfolio/${portfolioId}`);

      // Assert
      await expect(
        page.getByText(expectedText),
      ).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take screenshot of the French homepage', async ({ page }, testInfo) => {
      // Arrange
      const frenchLocale = '/fr';
      const expectedFrenchHeading = 'Code de démarrage pour Next.js avec Tailwind CSS';

      // Act
      await page.goto(frenchLocale);

      // Assert
      await expect(
        page.getByRole('heading', { name: expectedFrenchHeading }),
      ).toBeVisible();

      await takeSnapshot(page, testInfo);
    });
  });
});
