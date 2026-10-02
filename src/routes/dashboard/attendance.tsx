import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/attendance')({
  component: RedirectToSessions,
});

function RedirectToSessions() {
  return <Navigate to="/dashboard/sessions" replace />;
}
