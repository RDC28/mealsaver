import { cn } from '@/lib/utils'

type Status =
  | 'available'
  | 'accepted'
  | 'picked_up'
  | 'delivered'
  | 'expired'
  | 'pending'
  | 'in_transit'
  | 'rejected'

const statusMap: Record<Status, { label: string; className: string }> = {
  available: { label: 'Available', className: 'bg-green-50 text-green-700 border-green-200' },
  accepted:  { label: 'Accepted',  className: 'bg-blue-50 text-blue-700 border-blue-200' },
  picked_up: { label: 'Picked Up', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  delivered: { label: 'Delivered', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  expired:   { label: 'Expired',   className: 'bg-red-50 text-red-500 border-red-200' },
  pending:   { label: 'Pending',   className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  in_transit:{ label: 'In Transit',className: 'bg-purple-50 text-purple-700 border-purple-200' },
  rejected:  { label: 'Rejected',  className: 'bg-red-50 text-red-700 border-red-200' },
}

export function StatusBadge({ status }: { status: Status }) {
  const s = statusMap[status] ?? { label: status, className: 'bg-muted text-muted-foreground border-border' }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        s.className
      )}
    >
      {s.label}
    </span>
  )
}
