let initialization: Promise<typeof import('react-onesignal').default> | null = null;
let initializedOneSignal: typeof import('react-onesignal').default | null = null;

/** Returns the SDK only after initialization has completed. */
export function getInitializedOneSignal() {
  return initializedOneSignal;
}

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
      initializedOneSignal = OneSignal;
      return OneSignal;
    }).catch((error) => {
      // Let a later, user-initiated attempt retry after a transient SDK failure.
      initialization = null;
      throw error;
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
