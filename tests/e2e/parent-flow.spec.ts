import { expect, test } from '@playwright/test';

test('parent quick login can install from the dialog and log out without dismissing it first', async ({ page, context }) => {
  await page.goto('/login');
  const parentQuickLogin = page.getByRole('button', { name: /ولي الأمر والمتابع/ });
  await expect(parentQuickLogin).toBeEnabled();
  // Simulate the browser's early installability event on the login page. The
  // root app listener should retain it until the parent opens the dialog.
  await page.evaluate(() => {
    const promptEvent = new Event('beforeinstallprompt', { cancelable: true }) as Event & {
      prompt: () => Promise<void>;
      userChoice: Promise<{ outcome: 'accepted'; platform: string }>;
    };
    promptEvent.prompt = async () => {
      (window as Window & { __installPromptCalled?: boolean }).__installPromptCalled = true;
    };
    promptEvent.userChoice = Promise.resolve({ outcome: 'accepted', platform: 'web' });
    window.dispatchEvent(promptEvent);
  });

  await parentQuickLogin.click();
  await expect(page).toHaveURL(/\/dashboard\/sessions/);
  const dialog = page.getByRole('dialog', { name: 'تنبيهات حضور أبنائك' });
  await expect(dialog).toBeVisible();

  await expect(dialog.getByRole('button', { name: /تثبيت التطبيق/ })).toBeVisible();
  await dialog.getByRole('button', { name: /تثبيت التطبيق/ }).click();
  await expect.poll(() => page.evaluate(() =>
    (window as Window & { __installPromptCalled?: boolean }).__installPromptCalled,
  )).toBe(true);

  // The onboarding dialog covers the sidebar. It therefore provides its own
  // logout action so a parent can leave the account immediately.
  await dialog.getByRole('button', { name: 'تسجيل الخروج' }).click();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('heading', { name: 'مدرستنا القرآنية' })).toBeVisible();
  expect((await context.cookies()).some((cookie) => cookie.name === 'madrasa_session')).toBe(false);

  await page.goto('/dashboard/sessions');
  await expect(page).toHaveURL(/\/login/);
});

test('teacher quick login shows teacher navigation and logs out', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: /الشيخ والمعلم/ }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  const sidebar = page.locator('aside');
  await expect(sidebar.getByRole('link', { name: /قائمة الطلاب/ })).toBeVisible();
  await expect(sidebar.getByRole('link', { name: /الحصص واللقاءات اليومية/ })).toBeVisible();
  await expect(sidebar.getByRole('link', { name: 'أولياء الأمور' })).toHaveCount(0);
  await expect(sidebar.getByRole('link', { name: 'المعلمون والمشايخ' })).toHaveCount(0);

  await page.getByRole('button', { name: 'تسجيل الخروج' }).click();
  await expect(page).toHaveURL(/\/login/);
});

test('admin quick login shows management navigation and logs out', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: /مدير المدرسة \/ المشرف/ }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  const sidebar = page.locator('aside');
  await expect(sidebar.getByRole('link', { name: /قائمة الطلاب/ })).toBeVisible();
  await expect(sidebar.getByRole('link', { name: 'أولياء الأمور' })).toBeVisible();
  await expect(sidebar.getByRole('link', { name: 'المعلمون والمشايخ' })).toBeVisible();

  await page.getByRole('button', { name: 'تسجيل الخروج' }).click();
  await expect(page).toHaveURL(/\/login/);
});
