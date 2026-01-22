import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { FailureCard } from '@/components/failure/FailureCard';
import { DomainFilter } from '@/components/failure/DomainFilter';
import { useFailures } from '@/hooks/useFailures';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold">Failure Catalog</h1>
          <p className="mt-2 text-muted-foreground">
            Browse documented technical failures across domains.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-medium">Status</h3>
            <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as FailureStatus | 'all')}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="to_fail">TO FAIL</TabsTrigger>
                <TabsTrigger value="failed">FAILED</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium">Domain</h3>
            <DomainFilter
              selectedDomainId={selectedDomainId}
              onSelect={setSelectedDomainId}
            />
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : failures && failures.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {failures.map((failure) => (
              <FailureCard key={failure.id} failure={failure} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No failures found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
