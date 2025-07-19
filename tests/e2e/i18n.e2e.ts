import { expect, test } from '@playwright/test';

test.describe('I18n', () => {
  test.describe('Language Switching', () => {
    test('should switch language from English to French using dropdown and verify text on the homepage', async ({ page }) => {
      // Arrange
      const homepageUrl = '/';
      const englishHeading = 'Boilerplate Code for Your Next.js Project with Tailwind CSS';
      const frenchHeading = 'Code de démarrage pour Next.js avec Tailwind CSS';
      const langSwitcherLabel = 'lang-switcher';
      const frenchLocale = 'fr';

      // Act
      await page.goto(homepageUrl);

      await expect(
        page.getByRole('heading', { name: englishHeading }),
      ).toBeVisible();

      await page.getByLabel(langSwitcherLabel).selectOption(frenchLocale);

      // Assert
      await expect(
        page.getByRole('heading', { name: frenchHeading }),
      ).toBeVisible();
    });

    test('should switch language from English to French using URL and verify text on the sign-in page', async ({ page }) => {
      // Arrange
      const englishSignInUrl = '/sign-in';
      const frenchSignInUrl = '/fr/sign-in';
      const englishEmailText = 'Email address';
      const frenchEmailText = 'Adresse e-mail';

      // Act
      await page.goto(englishSignInUrl);

      await expect(page.getByText(englishEmailText)).toBeVisible();

      await page.goto(frenchSignInUrl);

      // Assert
      await expect(page.getByText(frenchEmailText)).toBeVisible();
    });
  });
});
