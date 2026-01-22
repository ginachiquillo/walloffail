-- Drop the overly permissive insert policy
DROP POLICY "Anyone can create failures" ON public.failures;

-- Create a more specific insert policy
-- Anonymous submissions set user_id to NULL, authenticated users must set user_id to their own id
CREATE POLICY "Users can create failures with proper user_id"
  ON public.failures FOR INSERT
  WITH CHECK (
    (auth.uid() IS NULL AND user_id IS NULL) OR 
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
  );