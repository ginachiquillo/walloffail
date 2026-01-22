export type FailureStatus = 'to_fail' | 'failed';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type AppRole = 'admin' | 'user';

export interface Domain {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  username: string | null;
  created_at: string;
  updated_at: string;
}

export interface Failure {
  id: string;
  user_id: string | null;
  domain_id: string;
  title: string;
  status: FailureStatus;
  verification_status: VerificationStatus;
  rejection_feedback: string | null;
  reason_for_project: string;
  problem_statement: string;
  initial_hypothesis: string;
  context_and_constraints: string;
  what_is_failing: string;
  what_was_tried: string;
  why_it_failed: string;
  who_is_relevant_for: string;
  created_at: string;
  updated_at: string;
  // Joined data
  domain?: Domain;
  profile?: Profile;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface StructuredFailure {
  title: string;
  reason_for_project: string;
  problem_statement: string;
  initial_hypothesis: string;
  context_and_constraints: string;
  what_is_failing: string;
  what_was_tried: string;
  why_it_failed: string;
  who_is_relevant_for: string;
}
