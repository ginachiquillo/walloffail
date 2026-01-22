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
import { useDomains } from '@/hooks/useDomains';
import { useCreateFailure } from '@/hooks/useFailures';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { FailureStatus } from '@/types';

const sections = [
  { key: 'reason_for_project', label: 'Reason for the Project', placeholder: 'Why was this problem worth attempting despite the risk of failure?' },
  { key: 'problem_statement', label: 'Problem Statement', placeholder: 'What specific problem were you trying to solve?' },
  { key: 'initial_hypothesis', label: 'Initial Hypothesis', placeholder: 'What did you believe would work?' },
  { key: 'context_and_constraints', label: 'Context and Constraints', placeholder: 'What environment, limitations, or requirements affected this project?' },
  { key: 'what_is_failing', label: 'What is Failing', placeholder: 'What specific aspect is not working?' },
  { key: 'what_was_tried', label: 'What Was Tried', placeholder: 'What approaches or solutions did you attempt?' },
  { key: 'why_it_failed', label: 'Why It Failed (Current Understanding)', placeholder: 'Based on what you know now, why did it fail?' },
  { key: 'who_is_relevant_for', label: 'Who This Failure is Relevant For', placeholder: 'Who might benefit from knowing about this failure?' },
] as const;

export function ManualSubmitForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: domains } = useDomains();
  const createFailure = useCreateFailure();

  const [title, setTitle] = useState('');
  const [domainId, setDomainId] = useState('');
  const [status, setStatus] = useState<FailureStatus>('to_fail');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!title || !domainId) {
      toast.error('Please fill in the title and select a domain.');
      return;
    }

    for (const section of sections) {
      if (!formData[section.key]) {
        toast.error(`Please fill in the "${section.label}" section.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await createFailure.mutateAsync({
        title,
        domain_id: domainId,
        status,
        user_id: user?.id || null,
        verification_status: user ? 'pending' : 'rejected',
        rejection_feedback: user ? null : 'Anonymous submissions are not verified.',
        reason_for_project: formData.reason_for_project,
        problem_statement: formData.problem_statement,
        initial_hypothesis: formData.initial_hypothesis,
        context_and_constraints: formData.context_and_constraints,
        what_is_failing: formData.what_is_failing,
        what_was_tried: formData.what_was_tried,
        why_it_failed: formData.why_it_failed,
        who_is_relevant_for: formData.who_is_relevant_for,
      });

      toast.success('Failure submitted successfully!');
      navigate('/catalog');
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="A clear, concise title for your failure"
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
              <Label htmlFor="to_fail" className="font-normal">TO FAIL (in progress)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="failed" id="failed" />
              <Label htmlFor="failed" className="font-normal">FAILED (concluded)</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {sections.map(({ key, label, placeholder }) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{label}</Label>
          <Textarea
            id={key}
            value={formData[key] || ''}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder={placeholder}
            rows={4}
            required
          />
        </div>
      ))}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Failure'}
      </Button>
    </form>
  );
}
