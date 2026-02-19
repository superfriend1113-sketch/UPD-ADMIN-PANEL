/**
 * Rejected Applications Page
 * View rejected retailer applications
 */

import { createClient } from '@/lib/supabase/server';
import StatusPill from '@/components/ui/StatusPill';

export const metadata = {
  title: 'Rejected Applications',
  description: 'Blocked from re-applying with same email',
};

async function getRejectedApplications() {
  const supabase = await createClient();
  
  // First, get all rejected applications
  const { data: applications, error } = await supabase
    .from('retailers')
    .select('*')
    .eq('status', 'rejected')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching rejected applications:', error);
    return [];
  }

  if (!applications || applications.length === 0) {
    return [];
  }

  // Get user_ids that are not null
  const userIds = applications
    .filter(r => r.user_id)
    .map(r => r.user_id);

  // Fetch emails from user_profiles for these user_ids
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('id, email')
    .in('id', userIds);

  // Create a map of user_id to email
  const emailMap = new Map(profiles?.map(p => [p.id, p.email]) || []);

  // Merge emails into application objects
  const applicationsWithEmails = applications.map(app => ({
    ...app,
    email: app.user_id ? emailMap.get(app.user_id) : null
  }));

  return applicationsWithEmails;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function RejectedApplicationsPage() {
  const applications = await getRejectedApplications();

  return (
    <div>
      {/* Header */}
      <div className="mb-[28px]">
        <h1 className="font-display text-[36px] tracking-[0.5px]">Rejected Applications</h1>
        <p className="text-[#888070] text-[13px] mt-[3px]">
          Blocked from re-applying with same email.
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-[#d6d0c4] rounded-[6px] overflow-hidden shadow-[0_2px_12px_rgba(13,13,13,0.10)] mb-[24px]">
        <div className="px-[20px] py-[16px] border-b border-[#d6d0c4] flex items-center justify-between bg-[#ede9df]">
          <div>
            <h3 className="text-[15px] font-semibold">Rejected</h3>
          </div>
          <StatusPill status="rejected" count={applications.length} />
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-[60px] px-[20px] text-[#888070]">
            <span className="text-[40px] block mb-[12px]">🚫</span>
            <h3 className="text-[18px] text-[#0d0d0d] mb-[6px]">No Rejected Applications</h3>
            <p className="text-[14px]">No applications have been rejected.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#ede9df] border-b border-[#d6d0c4]">
                  <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                    Business
                  </th>
                  <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                    Email
                  </th>
                  <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                    Reason
                  </th>
                  <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-[#d6d0c4] last:border-b-0 hover:bg-[#ede9df] transition-colors"
                  >
                    <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                      {app.name}
                    </td>
                    <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                      <span className="font-mono text-[12px]">{app.email || 'N/A'}</span>
                    </td>
                    <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                      {app.rejection_reason || 'No reason provided'}
                    </td>
                    <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                      {formatDate(app.updated_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
