import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { FailureCard } from '@/components/failure/FailureCard';
import { DomainTabs } from '@/components/home/DomainTabs';
import { StatusTabs } from '@/components/home/StatusTabs';
import { useFailures } from '@/hooks/useFailures';
import { Skeleton } from '@/components/ui/skeleton';
import { FailureStatus } from '@/types';

export default function Catalog() {
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<FailureStatus | 'all'>('all');

  const { data: failures, isLoading } = useFailures({
    domainId: selectedDomainId || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black">
            FAILURE <span className="text-primary text-glow">CATALOG</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse documented technical failures across domains.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-6">
          {/* Status Filter */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-lg font-semibold">Status Filter</h2>
            <StatusTabs selectedStatus={statusFilter} onSelect={setStatusFilter} />
          </div>

          {/* Domain Filter */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Domain</h3>
            <DomainTabs
              selectedDomainId={selectedDomainId}
              onSelect={setSelectedDomainId}
            />
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : failures && failures.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {failures.map((failure) => (
              <FailureCard key={failure.id} failure={failure} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">
              No failures found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
