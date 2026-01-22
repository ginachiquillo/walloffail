import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, FileText, Users, Shield } from 'lucide-react';

export default function Index() {
  const { user } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Where Technical Failures<br />Become Research Output
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Document what didn't work. Learn from others' failures. 
            Build a portfolio that proves you learn from experience.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/catalog">
              <Button size="lg" variant="outline">
                Browse Failures
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            {user ? (
              <Link to="/submit">
                <Button size="lg">
                  Submit a Failure
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth?mode=signup">
                <Button size="lg">
                  Start Your Portfolio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="border-y bg-card">
        <div className="container py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-2xl font-semibold">Founder Manifesto</h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                I was trained in research, where failure is documented, shared, and reused.
              </p>
              <p>
                I then spent years building startups, platforms, and large-scale architectures, 
                where failures still happen—but are erased, reframed, or hidden.
              </p>
              <p>
                I have worked on first-of-its-kind systems: SaaS platforms, confidential computing, 
                Web3 infrastructure, prescriptive AI, and large portfolios. In these environments, 
                failure is not an exception—it is a signal.
              </p>
              <p className="font-medium text-foreground">
                This platform exists because undocumented failure is collective technical debt.
              </p>
              <p>
                TO FAIL / FAILED is not about celebrating failure. 
                It is about preserving what was learned when things did not work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-serif text-2xl font-semibold">How It Works</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-medium">Document</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Structure your failure using our research-grade format. 
                AI-assisted or manual—your choice.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-medium">Get Verified</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Registered users get their submissions reviewed. 
                Verified failures carry more weight.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-medium">Share</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Build a portfolio of documented failures. 
                Share it with recruiters to prove you learn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-card">
        <div className="container py-16 text-center">
          <h2 className="font-serif text-2xl font-semibold">
            Ready to Document Your First Failure?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join a community that values honest learning over polished success stories.
          </p>
          <div className="mt-8">
            {user ? (
              <Link to="/submit">
                <Button size="lg">Submit a Failure</Button>
              </Link>
            ) : (
              <Link to="/auth?mode=signup">
                <Button size="lg">Create Your Account</Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
