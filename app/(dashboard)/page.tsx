/**
 * Dashboard Page
 * Redirects to pending applications page
 */

import { redirect } from 'next/navigation';

export default function DashboardPage() {
  redirect('/pending');
}
