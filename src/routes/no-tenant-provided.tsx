import { createFileRoute } from '@tanstack/react-router';
import NoTenantProvided from '../pages/no-tenant-provided';

export const Route = createFileRoute('/no-tenant-provided')({
  component: NoTenantProvided,
});
