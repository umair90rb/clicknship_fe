import { createFileRoute } from '@tanstack/react-router';
import NotFound from '../pages/not-found';

export const Route = createFileRoute('/not-found')({
  component: NotFound,
});
