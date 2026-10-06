import { expect, test } from '@playwright/test';

test('administrator can log in with the phone number and log out', async ({ page }) => {
  await page.goto('/login');
  await page.locator('input[type="tel"]').fill('0553588565');
  await page.locator('input[type="password"]').fill('admin123');
  await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  const sidebar = page.locator('aside');
  await expect(sidebar.getByRole('link', { name: /قائمة الطلاب/ })).toBeVisible();
  await expect(sidebar.getByRole('link', { name: 'أولياء الأمور' })).toBeVisible();
  await expect(sidebar.getByRole('link', { name: 'المعلمون والمشايخ' })).toBeVisible();

  await page.getByRole('button', { name: 'تسجيل الخروج' }).click();
  await expect(page).toHaveURL(/\/login/);
});

test('invalid phone credentials are rejected', async ({ page }) => {
  await page.goto('/login');
  await page.locator('input[type="tel"]').fill('0553588566');
  await page.locator('input[type="password"]').fill('admin123');
  await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByText(/رقم الهاتف أو كلمة المرور غير صحيحة/)).toBeVisible();
});
