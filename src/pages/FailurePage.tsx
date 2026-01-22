import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { FailureDetail } from '@/components/failure/FailureDetail';
import { useFailure } from '@/hooks/useFailures';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FailurePage() {
  const { id } = useParams<{ id: string }>();
  const { data: failure, isLoading, error } = useFailure(id || '');

  return (
    <Layout>
      <div className="container py-8">
        <Link to="/catalog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Catalog
          </Button>
        </Link>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-destructive">Error loading failure details.</p>
          </div>
        ) : failure ? (
          <FailureDetail failure={failure} />
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Failure not found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
