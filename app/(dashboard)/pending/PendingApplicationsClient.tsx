'use client';

/**
 * Pending Applications Client Component
 * Handles client-side interactions for the pending applications page
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/ui/StatCard';
import StatusPill from '@/components/ui/StatusPill';
import Chip from '@/components/ui/Chip';
import RiskFlag from '@/components/ui/RiskFlag';
import ApplicationDetailPanel from '@/components/dashboard/ApplicationDetailPanel';
import { ApprovalActions } from '@/components/dashboard/ApprovalActions';
import { showToast } from '@/components/ui/Toast';

interface PendingApplicationsClientProps {
  applications: any[];
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    approvalRate: number;
  };
}

function getRiskFlags(retailer: any) {
  const flags: { text: string; severity: 'default' | 'high' }[] = [];
  
  const freeEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const emailDomain = retailer.email?.split('@')[1]?.toLowerCase();
  if (emailDomain && freeEmailDomains.includes(emailDomain)) {
    flags.push({ text: 'Free email', severity: 'default' });
  }

  if (!retailer.website_url || retailer.website_url === 'None provided') {
    flags.push({ text: 'No website', severity: 'high' });
  }

  const currentYear = new Date().getFullYear();
  if (retailer.year_established && currentYear - retailer.year_established < 3) {
    flags.push({ text: 'New entity', severity: 'default' });
  }

  return flags;
}

function formatTimeAgo(date: string) {
  const now = new Date();
  const past = new Date(date);
  const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}

export default function PendingApplicationsClient({
  applications,
  stats,
}: PendingApplicationsClientProps) {
  const router = useRouter();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleRowClick = (app: any) => {
    setSelectedApplication(app);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedApplication(null);
  };

  const handleApprove = async (notes?: string) => {
    if (!selectedApplication) return;
    
    try {
      const response = await fetch(`/api/retailers/${selectedApplication.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: notes || 'Approved by admin review',
        }),
      });

      if (response.ok) {
        showToast('Application approved successfully', 'success');
        handleClosePanel();
        router.refresh();
      } else {
        showToast('Failed to approve application', 'error');
      }
    } catch (error) {
      console.error('Error approving application:', error);
      showToast('Error approving application', 'error');
    }
  };

  const handleReject = async (notes?: string) => {
    if (!selectedApplication) return;
    
    try {
      const response = await fetch(`/api/retailers/${selectedApplication.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: notes || 'Application rejected by admin review',
        }),
      });

      if (response.ok) {
        showToast('Application rejected', 'info');
        handleClosePanel();
        router.refresh();
      } else {
        showToast('Failed to reject application', 'error');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      showToast('Error rejecting application', 'error');
    }
  };

  return (
    <>
      <div>
        {/* Header */}
        <div className="mb-[28px]">
          <h1 className="font-display text-[36px] tracking-[0.5px]">Pending Applications</h1>
          <p className="text-[#888070] text-[13px] mt-[3px]">
            Manually review each applicant before granting platform access. No auto-approval.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-[16px] mb-[28px]">
          <StatCard
            label="Awaiting Review"
            value={stats.pending}
            subtitle={applications.length > 0 ? `Oldest: ${formatTimeAgo(applications[applications.length - 1].created_at)}` : 'No pending'}
            accent="accent1"
          />
          <StatCard
            label="Approved (All Time)"
            value={stats.approved}
            subtitle="Avg. review time: 18h"
            accent="accent2"
          />
          <StatCard
            label="Rejected"
            value={stats.rejected}
            subtitle="3 blocked emails"
            accent="accent3"
          />
          <StatCard
            label="Approval Rate"
            value={`${stats.approvalRate}%`}
            subtitle="Last 30 days"
            accent="accent4"
          />
        </div>

        {/* Table Card */}
        <div className="bg-white border border-[#d6d0c4] rounded-[6px] overflow-hidden shadow-[0_2px_12px_rgba(13,13,13,0.10)] mb-[24px]">
          <div className="px-[20px] py-[16px] border-b border-[#d6d0c4] flex items-center justify-between bg-[#ede9df]">
            <div>
              <h3 className="text-[15px] font-semibold">Pending Review Queue</h3>
              <p className="text-[12px] text-[#888070] mt-px">Click a row to open detailed review panel</p>
            </div>
            <StatusPill status="pending" count={applications.length} />
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-[60px] px-[20px] text-[#888070]">
              <span className="text-[40px] block mb-[12px]">📋</span>
              <h3 className="text-[18px] text-[#0d0d0d] mb-[6px]">No Pending Applications</h3>
              <p className="text-[14px]">All applications have been reviewed.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#ede9df] border-b border-[#d6d0c4]">
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Business Name
                    </th>
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Entity
                    </th>
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Volume
                    </th>
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Categories
                    </th>
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Risk Flags
                    </th>
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Submitted
                    </th>
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => {
                    const riskFlags = getRiskFlags(app);
                    
                    return (
                      <tr
                        key={app.id}
                        onClick={() => handleRowClick(app)}
                        className="border-b border-[#d6d0c4] last:border-b-0 hover:bg-[#ede9df] transition-colors cursor-pointer"
                      >
                        <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                          <strong>{app.name}</strong>
                          <br />
                          <span className="text-[11px] text-[#888070]">
                            {app.year_established} · {app.state}
                          </span>
                        </td>
                        <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                          <Chip>{app.entity_type || 'N/A'}</Chip>
                        </td>
                        <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                          <span className="font-mono text-[12px]">{app.email || 'N/A'}</span>
                        </td>
                        <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                          {app.volume || 'N/A'}
                        </td>
                        <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                          {app.categories?.slice(0, 2).join(', ') || 'N/A'}
                        </td>
                        <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                          {riskFlags.length > 0 ? (
                            <div className="flex flex-wrap gap-[4px]">
                              {riskFlags.map((flag, idx) => (
                                <RiskFlag key={idx} severity={flag.severity}>
                                  {flag.text}
                                </RiskFlag>
                              ))}
                            </div>
                          ) : (
                            ''
                          )}
                        </td>
                        <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                          {formatTimeAgo(app.created_at)}
                        </td>
                        <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                          <div onClick={(e) => e.stopPropagation()}>
                            <ApprovalActions retailerId={app.id} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      <ApplicationDetailPanel
        application={selectedApplication}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
}
