let initialization: Promise<typeof import('react-onesignal').default> | null = null;

export async function getOneSignal() {
  const appId = import.meta.env.ONESIGNAL_APP_ID;
  if (!appId || typeof window === 'undefined') return null;

  if (!initialization) {
    initialization = import('react-onesignal').then(async ({ default: OneSignal }) => {
      await OneSignal.init({
        appId,
        autoRegister: false,
        serviceWorkerPath: '/onesignal/OneSignalSDKWorker.js',
        serviceWorkerParam: { scope: '/onesignal/' },
      });
      return OneSignal;
    });
  }

  return initialization;
}

export async function logoutOneSignalUser() {
  if (!initialization) return;
  try {
    const OneSignal = await initialization;
    await OneSignal.logout();
  } catch (error) {
    console.warn('Unable to clear the OneSignal user identity:', error);
  }
}
