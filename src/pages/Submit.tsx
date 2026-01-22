import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ManualSubmitForm } from '@/components/submission/ManualSubmitForm';
import { AssistedSubmitForm } from '@/components/submission/AssistedSubmitForm';
import { useAuth } from '@/hooks/useAuth';
import { AlertTriangle } from 'lucide-react';

export default function Submit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submissionMode, setSubmissionMode] = useState<'assisted' | 'manual'>('assisted');

  return (
    <Layout>
      <div className="container py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold">Submit a Failure</h1>
            <p className="mt-2 text-muted-foreground">
              Document your technical failure for the community to learn from.
            </p>
          </div>

          {!user && (
            <Card className="mb-6 border-amber-500/50 bg-amber-500/5">
              <CardContent className="flex items-start gap-3 pt-6">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium">Submitting as Anonymous</p>
                  <p className="text-sm text-muted-foreground">
                    Your submission will be marked as "NOT VERIFIED".{' '}
                    <Button
                      variant="link"
                      className="h-auto p-0"
                      onClick={() => navigate('/auth?mode=signup')}
                    >
                      Create an account
                    </Button>{' '}
                    to get verified and build your portfolio.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Choose Your Submission Mode</CardTitle>
              <CardDescription>
                Use AI assistance to structure your failure, or fill in the form manually.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={submissionMode} onValueChange={(v) => setSubmissionMode(v as 'assisted' | 'manual')}>
                <TabsList className="mb-6 w-full">
                  <TabsTrigger value="assisted" className="flex-1">
                    AI-Assisted
                  </TabsTrigger>
                  <TabsTrigger value="manual" className="flex-1">
                    Manual Form
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="assisted">
                  <AssistedSubmitForm />
                </TabsContent>

                <TabsContent value="manual">
                  <ManualSubmitForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
