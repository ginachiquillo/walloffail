import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VerificationBadge } from './VerificationBadge';
import { StatusBadge } from './StatusBadge';
import { Failure } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface FailureCardProps {
  failure: Failure;
}

export function FailureCard({ failure }: FailureCardProps) {
  return (
    <Link to={`/failure/${failure.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={failure.status} />
            <VerificationBadge status={failure.verification_status} />
            {failure.domain && (
              <Badge variant="outline">{failure.domain.name}</Badge>
            )}
          </div>
          <h3 className="mt-2 font-serif text-xl font-semibold leading-tight">
            {failure.title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {failure.reason_for_project}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {failure.profile?.display_name || 'Anonymous'}
            </span>
            <span>
              {formatDistanceToNow(new Date(failure.created_at), { addSuffix: true })}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
