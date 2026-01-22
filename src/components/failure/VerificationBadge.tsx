import { Badge } from '@/components/ui/badge';
import { VerificationStatus } from '@/types';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface VerificationBadgeProps {
  status: VerificationStatus;
  className?: string;
}

export function VerificationBadge({ status, className }: VerificationBadgeProps) {
  const config = {
    verified: {
      label: 'VERIFIED',
      icon: CheckCircle,
      variant: 'default' as const,
    },
    pending: {
      label: 'PENDING',
      icon: Clock,
      variant: 'secondary' as const,
    },
    rejected: {
      label: 'NOT VERIFIED',
      icon: XCircle,
      variant: 'destructive' as const,
    },
  };

  const { label, icon: Icon, variant } = config[status];

  return (
    <Badge variant={variant} className={className}>
      <Icon className="mr-1 h-3 w-3" />
      {label}
    </Badge>
  );
}
