import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { StatsBar } from '@/components/home/StatsBar';
import { DomainTabs } from '@/components/home/DomainTabs';
import { StatusTabs } from '@/components/home/StatusTabs';
import { FailureCard } from '@/components/failure/FailureCard';
import { useAuth } from '@/hooks/useAuth';
import { useFailures } from '@/hooks/useFailures';
import { FailureStatus } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Search, Users } from 'lucide-react';

export default function Index() {
  const { user } = useAuth();
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<FailureStatus | 'all'>('all');
  
  const { data: failures, isLoading } = useFailures({
    domainId: selectedDomainId || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  // Show only first 6 failures on homepage
  const displayedFailures = failures?.slice(0, 6);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="container py-20 md:py-32 relative">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-black tracking-tight md:text-6xl lg:text-7xl">
            Failure is the ultimate{' '}
            <span className="text-primary text-glow">credential.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
            Document what didn't work. Learn from others' failures. 
            Build a portfolio that proves you learn from experience.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/catalog">
              <Button size="lg" variant="outline" className="gap-2 border-primary/50 hover:border-primary hover:bg-primary/10">
                <Search className="h-4 w-4" />
                Find an Expert by Failures
              </Button>
            </Link>
            <Link to="/catalog">
              <Button size="lg" className="gap-2 font-bold glow-primary">
                Explore the Wall
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="container">
        <StatsBar />
      </section>

      {/* Filters Section */}
      <section className="container py-8">
        <div className="space-y-6">
          {/* Status Filter */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-bold">
              DAMAGE ASSESSMENT
            </h2>
            <StatusTabs selectedStatus={statusFilter} onSelect={setStatusFilter} />
          </div>
          
          {/* Domain Filter */}
          <DomainTabs selectedDomainId={selectedDomainId} onSelect={setSelectedDomainId} />
        </div>
      </section>

      {/* Failure Cards Grid */}
      <section className="container pb-16">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : displayedFailures && displayedFailures.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedFailures.map((failure) => (
                <FailureCard key={failure.id} failure={failure} />
              ))}
            </div>
            {failures && failures.length > 6 && (
              <div className="mt-8 text-center">
                <Link to="/catalog">
                  <Button variant="outline" size="lg" className="gap-2">
                    View All Failures
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center">
            <p className="text-muted-foreground mb-4">
              No failures documented yet. Be the first to share!
            </p>
            {user ? (
              <Link to="/submit">
                <Button className="glow-primary">Submit First Failure</Button>
              </Link>
            ) : (
              <Link to="/auth?mode=signup">
                <Button className="glow-primary">Sign Up to Submit</Button>
              </Link>
            )}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="container py-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">
              Join the Wall
            </h2>
          </div>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Undocumented failure is collective technical debt.
            Start building your portfolio of documented learnings.
          </p>
          <div className="mt-8">
            {user ? (
              <Link to="/submit">
                <Button size="lg" className="font-bold glow-primary">
                  SUBMIT A FAILURE
                </Button>
              </Link>
            ) : (
              <Link to="/auth?mode=signup">
                <Button size="lg" className="font-bold glow-primary">
                  CREATE YOUR ACCOUNT
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
