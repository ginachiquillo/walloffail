import { Badge } from '@/components/ui/badge';
import { FailureStatus } from '@/types';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: FailureStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    to_fail: {
      label: 'TO FAIL',
      icon: AlertTriangle,
      className: 'bg-amber-500 text-amber-50 hover:bg-amber-500/80',
    },
    failed: {
      label: 'FAILED',
      icon: CheckCircle,
      className: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    },
  };

  const { label, icon: Icon, className: badgeClassName } = config[status];

  return (
    <Badge className={`${badgeClassName} ${className}`}>
      <Icon className="mr-1 h-3 w-3" />
      {label}
    </Badge>
  );
}
