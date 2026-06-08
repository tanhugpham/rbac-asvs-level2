'use client';

import { Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TicketHistoryProps {
  tickets: Ticket[];
}

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  OPEN: { label: 'Open', icon: AlertCircle, color: 'text-yellow-400' },
  IN_PROGRESS: { label: 'In Progress', icon: Loader2, color: 'text-blue-400' },
  RESOLVED: { label: 'Resolved', icon: CheckCircle, color: 'text-green-400' },
  CLOSED: { label: 'Closed', icon: CheckCircle, color: 'text-gray-400' },
};

const CATEGORY_LABELS: Record<string, string> = {
  QUESTION: 'Question',
  COMPLAINT: 'Complaint',
  REQUEST: 'Request',
  OTHER: 'Other',
};

export function TicketHistory({ tickets }: TicketHistoryProps) {
  if (tickets.length === 0) {
    return (
      <p className="text-sm text-gray-400">Bạn chưa có yêu cầu hỗ trợ nào.</p>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => {
        const statusConfig = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.OPEN;
        const StatusIcon = statusConfig.icon;

        return (
          <div
            key={ticket.id}
            className="rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-white truncate">
                    {ticket.subject}
                  </h4>
                  <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-400">
                    {CATEGORY_LABELS[ticket.category] || ticket.category}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-gray-400">
                  {ticket.message}
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(ticket.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                <span className={`text-sm ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}