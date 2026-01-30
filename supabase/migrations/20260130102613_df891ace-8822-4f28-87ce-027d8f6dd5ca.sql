-- Fix handle_new_user function to add input validation for display_name
-- This prevents extremely long strings or control characters from being inserted

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sanitized_display_name text;
BEGIN
  -- Sanitize display_name: remove control characters and limit to 100 characters
  sanitized_display_name := COALESCE(
    LEFT(
      REGEXP_REPLACE(
        NEW.raw_user_meta_data->>'display_name',
        E'[\\x00-\\x1F\\x7F]',
        '',
        'g'
      ),
      100
    ),
    split_part(NEW.email, '@', 1)
  );

  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, sanitized_display_name);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;