import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { VerificationBadge } from './VerificationBadge';
import { StatusBadge } from './StatusBadge';
import { Failure } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface FailureCardProps {
  failure: Failure;
}

export function FailureCard({ failure }: FailureCardProps) {
  const initials = failure.profile?.display_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  return (
    <Link to={`/failure/${failure.id}`}>
      <Card className="h-full transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 bg-card/80 backdrop-blur-sm">
        {/* Placeholder image area */}
        <div className="aspect-video bg-secondary/30 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-black text-muted-foreground/20">
              {failure.status === 'to_fail' ? '⚠️' : '💥'}
            </div>
          </div>
          {/* Status badge overlay */}
          <div className="absolute top-3 left-3">
            <StatusBadge status={failure.status} />
          </div>
          {/* Avatar overlay */}
          <div className="absolute bottom-3 right-3">
            <Avatar className="h-8 w-8 border-2 border-background">
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <CardHeader className="pb-2 pt-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <VerificationBadge status={failure.verification_status} />
            {failure.domain && (
              <Badge variant="outline" className="text-xs uppercase tracking-wider">
                {failure.domain.name}
              </Badge>
            )}
          </div>
          <h3 className="font-bold text-lg leading-tight line-clamp-2">
            {failure.title}
          </h3>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="line-clamp-2 text-sm text-muted-foreground mb-4">
            {failure.reason_for_project}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">
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
