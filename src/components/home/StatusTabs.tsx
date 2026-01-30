import { Button } from '@/components/ui/button';
import { FailureStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusTabsProps {
  selectedStatus: FailureStatus | 'all';
  onSelect: (status: FailureStatus | 'all') => void;
}

export function StatusTabs({ selectedStatus, onSelect }: StatusTabsProps) {
  const statuses: { value: FailureStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'ALL' },
    { value: 'to_fail', label: 'TO FAIL' },
    { value: 'failed', label: 'FAILED' },
  ];

  return (
    <div className="flex gap-2">
      {statuses.map((status) => (
        <Button
          key={status.value}
          variant={selectedStatus === status.value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onSelect(status.value)}
          className={cn(
            "font-bold tracking-wider",
            selectedStatus === status.value && "glow-primary",
            status.value === 'to_fail' && selectedStatus === status.value && "bg-amber-500 hover:bg-amber-600 text-background",
            status.value === 'failed' && selectedStatus === status.value && "bg-destructive hover:bg-destructive/90"
          )}
        >
          {status.label}
        </Button>
      ))}
    </div>
  );
}
