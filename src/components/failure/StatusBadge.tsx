import { Badge } from '@/components/ui/badge';
import { FailureStatus } from '@/types';
import { AlertTriangle, Skull } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: FailureStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const isToFail = status === 'to_fail';
  const Icon = isToFail ? AlertTriangle : Skull;
  
  return (
    <Badge 
      className={cn(
        "font-bold uppercase tracking-wider gap-1",
        isToFail 
          ? "bg-amber-500/90 text-amber-950 hover:bg-amber-500" 
          : "bg-destructive/90 text-destructive-foreground hover:bg-destructive",
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {isToFail ? 'TO FAIL' : 'FAILED'}
    </Badge>
  );
}
