import { useFailureStats } from '@/hooks/useFailures';
import { Skeleton } from '@/components/ui/skeleton';

export function StatsBar() {
  const { data: stats, isLoading } = useFailureStats();

  if (isLoading) {
    return (
      <div className="flex justify-center gap-12 py-8 border-y border-border/50">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center">
            <Skeleton className="h-10 w-20 mx-auto mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    { value: stats?.totalFailures || 0, label: 'Documented Failures' },
    { value: stats?.verifiedEngineers || 0, label: 'Verified Engineers' },
    { value: stats?.activeBlockers || 0, label: 'Active Blockers' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-16 py-8 border-y border-border/50">
      {statItems.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-primary text-glow">
            {stat.value.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
