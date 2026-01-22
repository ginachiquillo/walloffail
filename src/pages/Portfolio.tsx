import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { FailureCard } from '@/components/failure/FailureCard';
import { useFailures } from '@/hooks/useFailures';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Portfolio() {
  const { username } = useParams<{ username: string }>();
  const { user, profile: currentProfile } = useAuth();

  // If no username provided, show current user's portfolio
  const isOwnPortfolio = !username || (currentProfile?.username === username) || (currentProfile?.user_id === username);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      if (!username) {
        // Current user's portfolio
        if (!user) return null;
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        return data as Profile | null;
      }
      
      // Try username first, then user_id
      let { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .maybeSingle();
      
      if (!data) {
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', username)
          .maybeSingle();
        data = result.data;
      }
      
      return data as Profile | null;
    },
    enabled: !!username || !!user,
  });

  const { data: failures, isLoading: failuresLoading } = useFailures({
    userId: profile?.user_id,
  });

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Portfolio link copied to clipboard!');
  };

  if (!username && !user) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="font-serif text-2xl font-bold">Sign in to view your portfolio</h1>
          <p className="mt-2 text-muted-foreground">
            Create an account to start building your failure portfolio.
          </p>
          <Link to="/auth?mode=signup">
            <Button className="mt-6">Get Started</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const isLoading = profileLoading || failuresLoading;

  return (
    <Layout>
      <div className="container py-8">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-6 w-1/2" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          </div>
        ) : profile ? (
          <>
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="font-serif text-3xl font-bold">
                  {profile.display_name || 'Anonymous'}'s Wall of Fail
                </h1>
                {profile.bio && (
                  <p className="mt-2 text-muted-foreground">{profile.bio}</p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">
                  {failures?.length || 0} documented failure{failures?.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share Portfolio
              </Button>
            </div>

            {failures && failures.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {failures.map((failure) => (
                  <FailureCard key={failure.id} failure={failure} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  {isOwnPortfolio
                    ? "You haven't documented any failures yet."
                    : 'No failures documented yet.'}
                </p>
                {isOwnPortfolio && (
                  <Link to="/submit">
                    <Button className="mt-4">Submit Your First Failure</Button>
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Portfolio not found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
