import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

test.describe('Counter', () => {
  test.describe('Basic database operations', () => {
    test('shouldn\'t increment the counter with an invalid input', async ({ page }) => {
      // Arrange
      const invalidPayload = {
        increment: 'incorrect',
      };

      // Act
      const counter = await page.request.put('/api/counter', {
        data: invalidPayload,
      });

      // Assert
      expect(counter.status()).toBe(422);
    });

    test('shouldn\'t increment the counter with a negative number', async ({ page }) => {
      // Arrange
      const negativePayload = {
        increment: -1,
      };

      // Act
      const counter = await page.request.put('/api/counter', {
        data: negativePayload,
      });

      // Assert
      expect(counter.status()).toBe(422);
    });

    test('shouldn\'t increment the counter with a number greater than 3', async ({ page }) => {
      // Arrange
      const invalidPayload = {
        increment: 5,
      };

      // Act
      const counter = await page.request.put('/api/counter', {
        data: invalidPayload,
      });

      // Assert
      expect(counter.status()).toBe(422);
    });

    test('should increment the counter and update the counter correctly', async ({ page }) => {
      // Arrange
      // `x-e2e-random-id` is used for end-to-end testing to make isolated requests
      // The default value is 0 when there is no `x-e2e-random-id` header
      const e2eRandomId = faker.number.int({ max: 1000000 });
      const headers = {
        'x-e2e-random-id': e2eRandomId.toString(),
      };
      const firstIncrement = { increment: 1 };
      const secondIncrement = { increment: 2 };
      const thirdIncrement = { increment: 1 };

      // Act - First increment
      let counter = await page.request.put('/api/counter', {
        data: firstIncrement,
        headers,
      });
      let counterJson = await counter.json();

      // Assert - First increment
      expect(counter.status()).toBe(200);

      const initialCount = counterJson.count;

      // Act - Second increment
      counter = await page.request.put('/api/counter', {
        data: secondIncrement,
        headers,
      });
      counterJson = await counter.json();

      // Assert - Second increment
      expect(counter.status()).toBe(200);
      expect(counterJson.count).toEqual(initialCount + 2);

      // Act - Third increment
      counter = await page.request.put('/api/counter', {
        data: thirdIncrement,
        headers,
      });
      counterJson = await counter.json();

      // Assert - Third increment
      expect(counter.status()).toBe(200);
      expect(counterJson.count).toEqual(initialCount + 3);
    });
  });
});
