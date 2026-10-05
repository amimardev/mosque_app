type AttendancePush = {
  externalId: string;
  title: string;
  message: string;
  href?: string | null;
};

/** Sends one parent-targeted push. OneSignal owns the browser subscriptions. */
export async function sendAttendancePush({ externalId, title, message, href }: AttendancePush) {
  const appId = process.env.ONESIGNAL_APP_ID;
  const apiKey = process.env.ONESIGNAL_REST_API_KEY;
  if (!appId || !apiKey) return;

  try {
    const appUrl = process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
    const destination = href && appUrl ? new URL(href, appUrl).toString() : undefined;
    const response = await fetch('https://api.onesignal.com/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Key ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        target_channel: 'push',
        include_aliases: { external_id: [externalId] },
        headings: { ar: title, en: title },
        contents: { ar: message, en: message },
        ...(destination ? { url: destination } : {}),
      }),
    });

    if (!response.ok) {
      console.error('OneSignal push request failed:', response.status, await response.text());
    }
  } catch (error) {
    // Push delivery must not roll back an attendance save or its in-app notice.
    console.error('Unable to send OneSignal attendance push:', error);
  }
}
