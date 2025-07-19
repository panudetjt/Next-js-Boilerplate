import assert from 'node:assert';
import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

test.describe('Counter', () => {
  test.describe('Increment operation', () => {
    test('should display error message when incrementing with negative number', async ({
      page,
    }) => {
      // Arrange
      const counterUrl = '/counter';
      const negativeValue = '-1';
      const expectedErrorMessage = 'Value must be between 1 and 3';
      const incrementLabel = 'Increment by';
      const incrementButtonName = 'Increment';

      // Act
      await page.goto(counterUrl);
      const count = page.getByText('Count:');
      const initialCountText = await count.textContent();
      assert(initialCountText !== null, 'Count should not be null');

      await page.getByLabel(incrementLabel).fill(negativeValue);
      await page.getByRole('button', { name: incrementButtonName }).click();

      // Assert
      await expect(page.getByText(expectedErrorMessage)).toBeVisible();
      await expect(page.getByText('Count:')).toHaveText(initialCountText);
    });

    test('should increment the counter and validate the count', async ({
      page,
    }) => {
      // Arrange
      // `x-e2e-random-id` is used for end-to-end testing to make isolated requests
      // The default value is 0 when there is no `x-e2e-random-id` header
      const e2eRandomId = faker.number.int({ max: 1000000 });
      const counterUrl = '/counter';
      const firstIncrement = '2';
      const secondIncrement = '3';
      const incrementLabel = 'Increment by';
      const incrementButtonName = 'Increment';

      await page.setExtraHTTPHeaders({
        'x-e2e-random-id': e2eRandomId.toString(),
      });

      // Act
      await page.goto(counterUrl);
      const count = page.getByText('Count:');
      const countText = await count.textContent();
      assert(countText !== null, 'Count should not be null');
      const initialCountNumber = Number(countText.split(' ')[1]);

      await page.getByLabel(incrementLabel).fill(firstIncrement);
      await page.getByRole('button', { name: incrementButtonName }).click();

      // Assert - First increment
      await expect(page.getByText('Count:')).toHaveText(`Count: ${initialCountNumber + 2}`);

      // Act - Second increment
      await page.getByLabel(incrementLabel).fill(secondIncrement);
      await page.getByRole('button', { name: incrementButtonName }).click();

      // Assert - Second increment
      await expect(page.getByText('Count:')).toHaveText(`Count: ${initialCountNumber + 5}`);
    });
  });
});
