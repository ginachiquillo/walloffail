import { Failure } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VerificationBadge } from './VerificationBadge';
import { StatusBadge } from './StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface FailureDetailProps {
  failure: Failure;
}

const sections = [
  { key: 'reason_for_project', title: 'Reason for the Project' },
  { key: 'problem_statement', title: 'Problem Statement' },
  { key: 'initial_hypothesis', title: 'Initial Hypothesis' },
  { key: 'context_and_constraints', title: 'Context and Constraints' },
  { key: 'what_is_failing', title: 'What is Failing' },
  { key: 'what_was_tried', title: 'What Was Tried' },
  { key: 'why_it_failed', title: 'Why It Failed (Current Understanding)' },
  { key: 'who_is_relevant_for', title: 'Who This Failure is Relevant For' },
] as const;

export function FailureDetail({ failure }: FailureDetailProps) {
  return (
    <article className="space-y-6">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={failure.status} />
          <VerificationBadge status={failure.verification_status} />
          {failure.domain && (
            <Badge variant="outline">{failure.domain.name}</Badge>
          )}
        </div>
        
        <h1 className="font-serif text-3xl font-bold md:text-4xl">
          {failure.title}
        </h1>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {failure.profile ? (
            <Link 
              to={`/portfolio/${failure.profile.username || failure.user_id}`}
              className="hover:text-foreground"
            >
              By {failure.profile.display_name || 'Anonymous'}
            </Link>
          ) : (
            <span>By Anonymous</span>
          )}
          <span>•</span>
          <span>
            {formatDistanceToNow(new Date(failure.created_at), { addSuffix: true })}
          </span>
        </div>
      </header>

      {/* Rejection feedback if rejected */}
      {failure.verification_status === 'rejected' && failure.rejection_feedback && (
        <Card className="border-destructive bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-destructive">
              Verification Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{failure.rejection_feedback}</p>
          </CardContent>
        </Card>
      )}

      {/* Structured Sections */}
      {sections.map(({ key, title }) => (
        <section key={key} className="space-y-2">
          <h2 className="font-serif text-xl font-semibold">{title}</h2>
          <p className="whitespace-pre-wrap text-muted-foreground">
            {failure[key]}
          </p>
        </section>
      ))}
    </article>
  );
}
