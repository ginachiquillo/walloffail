import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { useDomains } from '@/hooks/useDomains';
import { useCreateFailure } from '@/hooks/useFailures';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { FailureStatus, StructuredFailure } from '@/types';
import { Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function AssistedSubmitForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: domains } = useDomains();
  const createFailure = useCreateFailure();

  const [freeText, setFreeText] = useState('');
  const [domainId, setDomainId] = useState('');
  const [status, setStatus] = useState<FailureStatus>('to_fail');
  const [isProcessing, setIsProcessing] = useState(false);
  const [structuredData, setStructuredData] = useState<StructuredFailure | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProcess = async () => {
    if (!user) {
      toast.error('Please sign in to use AI-assisted submission.');
      navigate('/auth');
      return;
    }

    if (!freeText.trim()) {
      toast.error('Please describe your failure first.');
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('structure-failure', {
        body: { description: freeText },
      });

      if (error) {
        // Handle authentication errors specifically
        if (error.message?.includes('Authentication required') || error.message?.includes('401')) {
          toast.error('Please sign in to use AI-assisted submission.');
          navigate('/auth');
          return;
        }
        throw error;
      }

      setStructuredData(data as StructuredFailure);
      toast.success('AI has structured your failure!');
    } catch (error) {
      console.error('Error processing:', error);
      toast.error('Failed to process. Please try again or use manual mode.');
    }

    setIsProcessing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!structuredData) {
      toast.error('Please process your description first.');
      return;
    }

    if (!domainId) {
      toast.error('Please select a domain.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createFailure.mutateAsync({
        title: structuredData.title,
        domain_id: domainId,
        status,
        user_id: user?.id || null,
        verification_status: user ? 'pending' : 'rejected',
        rejection_feedback: user ? null : 'Anonymous submissions are not verified.',
        reason_for_project: structuredData.reason_for_project,
        problem_statement: structuredData.problem_statement,
        initial_hypothesis: structuredData.initial_hypothesis,
        context_and_constraints: structuredData.context_and_constraints,
        what_is_failing: structuredData.what_is_failing,
        what_was_tried: structuredData.what_was_tried,
        why_it_failed: structuredData.why_it_failed,
        who_is_relevant_for: structuredData.who_is_relevant_for,
      });

      toast.success('Failure submitted successfully!');
      navigate('/catalog');
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    }

    setIsSubmitting(false);
  };

  const handleEdit = (key: keyof StructuredFailure, value: string) => {
    if (structuredData) {
      setStructuredData({ ...structuredData, [key]: value });
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Free text input */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="freeText">Describe Your Failure</Label>
          <p className="text-sm text-muted-foreground">
            Write freely about what you tried, what went wrong, and what you learned.
            The AI will structure it for you.
          </p>
        </div>
        <Textarea
          id="freeText"
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          placeholder="I was building a real-time collaborative editor for my SaaS platform. The initial approach used WebSockets with a central server managing state. After 3 months of development, we realized the approach couldn't scale beyond 50 concurrent users because..."
          rows={8}
          disabled={isProcessing || !!structuredData}
        />
        {!structuredData && (
          <Button onClick={handleProcess} disabled={isProcessing || !freeText.trim()}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Structure with AI
              </>
            )}
          </Button>
        )}
      </div>

      {/* Step 2: Review structured data */}
      {structuredData && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                ✨ AI has structured your failure. Review and edit below, then submit.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={structuredData.title}
              onChange={(e) => handleEdit('title', e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Select value={domainId} onValueChange={setDomainId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains?.map((domain) => (
                    <SelectItem key={domain.id} value={domain.id}>
                      {domain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <RadioGroup value={status} onValueChange={(v) => setStatus(v as FailureStatus)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="to_fail" id="to_fail" />
                  <Label htmlFor="to_fail" className="font-normal">TO FAIL</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="failed" id="failed" />
                  <Label htmlFor="failed" className="font-normal">FAILED</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {[
            { key: 'reason_for_project', label: 'Reason for the Project' },
            { key: 'problem_statement', label: 'Problem Statement' },
            { key: 'initial_hypothesis', label: 'Initial Hypothesis' },
            { key: 'context_and_constraints', label: 'Context and Constraints' },
            { key: 'what_is_failing', label: 'What is Failing' },
            { key: 'what_was_tried', label: 'What Was Tried' },
            { key: 'why_it_failed', label: 'Why It Failed' },
            { key: 'who_is_relevant_for', label: 'Who This is Relevant For' },
          ].map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Textarea
                id={key}
                value={structuredData[key as keyof StructuredFailure]}
                onChange={(e) => handleEdit(key as keyof StructuredFailure, e.target.value)}
                rows={3}
                required
              />
            </div>
          ))}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStructuredData(null)}
            >
              Start Over
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Failure'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
