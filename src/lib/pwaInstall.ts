export type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

type InstallPromptListener = (event: InstallPromptEvent | null) => void;
type AppInstalledListener = () => void;

let deferredInstallPrompt: InstallPromptEvent | null = null;
const listeners = new Set<InstallPromptListener>();
const installedListeners = new Set<AppInstalledListener>();

function publishInstallPrompt(event: InstallPromptEvent | null) {
  deferredInstallPrompt = event;
  listeners.forEach((listener) => listener(event));
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event: Event) => {
    event.preventDefault();
    publishInstallPrompt(event as InstallPromptEvent);
  });

  window.addEventListener('appinstalled', () => {
    publishInstallPrompt(null);
    installedListeners.forEach((listener) => listener());
  });
}

export function subscribeInstallPrompt(listener: InstallPromptListener) {
  listeners.add(listener);
  listener(deferredInstallPrompt);
  return () => listeners.delete(listener);
}

export function consumeInstallPrompt() {
  const event = deferredInstallPrompt;
  publishInstallPrompt(null);
  return event;
}

export function subscribeAppInstalled(listener: AppInstalledListener) {
  installedListeners.add(listener);
  return () => installedListeners.delete(listener);
}
