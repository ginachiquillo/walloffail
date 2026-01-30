import { Badge } from '@/components/ui/badge';
import { VerificationStatus } from '@/types';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationBadgeProps {
  status: VerificationStatus;
  className?: string;
}

export function VerificationBadge({ status, className }: VerificationBadgeProps) {
  const config = {
    pending: {
      icon: Clock,
      label: 'Pending',
      badgeClassName: 'bg-muted/50 text-muted-foreground border-muted',
    },
    verified: {
      icon: CheckCircle2,
      label: 'Verified',
      badgeClassName: 'bg-primary/20 text-primary border-primary/30',
    },
    rejected: {
      icon: XCircle,
      label: 'Rejected',
      badgeClassName: 'bg-destructive/20 text-destructive border-destructive/30',
    },
  };

  const { icon: Icon, label, badgeClassName } = config[status];

  return (
    <Badge variant="outline" className={cn("gap-1 text-xs", badgeClassName, className)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
