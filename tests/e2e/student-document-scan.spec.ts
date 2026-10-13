import { expect, test } from '@playwright/test';

const onePixelPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jT7sAAAAASUVORK5CYII=';
const scanToken = 'test-scanner-agent-token-1234567890';

test('admin reviews a scan and explicitly overrides a same-name warning', async ({ page }) => {
  await page.route('http://127.0.0.1:8765/**', async (route) => {
    const request = route.request();
    const headers = {
      'access-control-allow-origin': 'http://127.0.0.1:4173',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'content-type, x-scanner-agent-token',
    };
    if (request.method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers });
      return;
    }
    const pathname = new URL(request.url()).pathname;
    if (pathname === '/health') {
      await route.fulfill({ status: 200, headers, contentType: 'application/json', body: JSON.stringify({ ok: true, token_configured: true }) });
    } else if (pathname === '/scanners') {
      await route.fulfill({ status: 200, headers, contentType: 'application/json', body: JSON.stringify({ scanners: [{ id: 'test-wia', name: 'Test scanner' }] }) });
    } else if (pathname === '/scan') {
      await route.fulfill({
        status: 200,
        headers,
        contentType: 'application/json',
        body: JSON.stringify({ scan_id: 'test-scan', mime_type: 'image/png', image_base64: onePixelPng }),
      });
    } else {
      await route.fulfill({ status: 404, headers, contentType: 'application/json', body: '{}' });
    }
  });

  await page.goto('/login');
  await page.locator('input[type="tel"]').fill('0553588565');
  await page.locator('input[type="password"]').fill('admin123');
  await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await page.goto('/dashboard/students');

  const openScanDialog = async () => {
    await page.getByRole('button', { name: 'إنشاء طالب من وثيقة' }).click();
    await page.getByLabel('رمز خدمة الماسح').fill(scanToken);
    await page.getByRole('button', { name: 'الاتصال والبحث عن الماسحات' }).click();
    await page.getByLabel('اختر الماسح').selectOption('test-wia');
    await page.getByRole('button', { name: 'مسح الوثيقة' }).click();
    await expect(page.getByRole('img', { name: 'الوثيقة الممسوحة' })).toBeVisible();
    await expect(page.getByLabel('اسم الطالب *')).toBeVisible();
  };

  await openScanDialog();
  await page.getByLabel('اسم الطالب *').fill('طالب اختبار المسح');
  await page.getByRole('button', { name: 'موافق وحفظ الطالب' }).click();
  await expect(page.getByText('طالب اختبار المسح', { exact: true })).toBeVisible();

  await openScanDialog();
  await page.getByLabel('اسم الطالب *').fill('طالب اختبار المسح');
  await page.getByRole('button', { name: 'موافق وحفظ الطالب' }).click();
  await expect(page.getByRole('alertdialog', { name: 'طالب بنفس الاسم موجود' })).toBeVisible();
  await page.getByRole('button', { name: 'إنشاء على أي حال' }).click();
  await expect(page.getByText('طالب اختبار المسح', { exact: true }).nth(1)).toBeVisible();
});
