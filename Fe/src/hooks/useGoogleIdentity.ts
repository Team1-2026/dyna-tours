'use client';

import { useEffect, useRef, useState } from 'react';

const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
const GIS_SCRIPT_ID = 'google-identity-services';

let scriptPromise: Promise<void> | null = null;

function loadGoogleIdentityScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Identity requires a browser.'));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(GIS_SCRIPT_ID) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Identity script.')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.id = GIS_SCRIPT_ID;
    script.src = GIS_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('Failed to load Google Identity script.'));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function useGoogleIdentity(options: {
  enabled: boolean;
  clientId: string | undefined;
  onCredential: (credential: string) => void | Promise<void>;
}) {
  const { enabled, clientId, onCredential } = options;
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState('');
  const callbackRef = useRef(onCredential);

  useEffect(() => {
    callbackRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!enabled || !clientId) {
      setIsReady(false);
      return;
    }

    let cancelled = false;

    const setup = async () => {
      try {
        await loadGoogleIdentityScript();
        if (cancelled || !window.google?.accounts?.id) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) {
              void callbackRef.current(response.credential);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          context: 'signin',
          itp_support: true,
        });

        if (buttonRef.current) {
          buttonRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(buttonRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'pill',
            width: 320,
          });
        }

        window.google.accounts.id.prompt();
        if (!cancelled) {
          setIsReady(true);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setIsReady(false);
          setError(err instanceof Error ? err.message : 'Google Sign-In is unavailable.');
        }
      }
    };

    void setup();

    return () => {
      cancelled = true;
      try {
        window.google?.accounts?.id?.cancel();
      } catch {
        // ignore
      }
    };
  }, [clientId, enabled]);

  return { buttonRef, isReady, error, isConfigured: Boolean(clientId) };
}
