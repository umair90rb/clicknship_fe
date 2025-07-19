import { createRootRoute, redirect } from '@tanstack/react-router';
import { RootLayout } from '../ui';

export const Route = createRootRoute({
  loader: ({ location }) => {
    let hostname = window.location.hostname;
    hostname = hostname.replaceAll(/www./g, '');
    const parts = hostname.split('.');
    let subdomain: string | null = null;
    const isLocalhost = hostname.includes('localhost');
    if (isLocalhost && parts.length === 2) {
      subdomain = parts[0];
    } else if (parts.length > 2) {
      subdomain = parts[0];
    }
    if (!subdomain) {
      // Prevent infinite redirects: don't redirect if already on /no-tenant-provided
      if (!location.pathname.startsWith('/no-tenant-provided')) {
        throw redirect({ to: '/no-tenant-provided' });
      }
    }

    window.localStorage.setItem('tenantId', subdomain as string);
    return { tenant: subdomain };
  },
  component: RootLayout,
});
