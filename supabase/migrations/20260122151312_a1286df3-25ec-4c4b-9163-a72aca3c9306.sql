-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create enum for failure status
CREATE TYPE public.failure_status AS ENUM ('to_fail', 'failed');

-- Create enum for verification status
CREATE TYPE public.verification_status AS ENUM ('pending', 'verified', 'rejected');

-- Create domains table
CREATE TABLE public.domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default domains
INSERT INTO public.domains (name, description) VALUES
  ('SaaS', 'Software as a Service platforms and applications'),
  ('Web3', 'Blockchain, crypto, and decentralized applications'),
  ('AI/ML', 'Artificial Intelligence and Machine Learning'),
  ('Infrastructure', 'Cloud, DevOps, and system architecture'),
  ('Mobile', 'Mobile applications and platforms'),
  ('Security', 'Cybersecurity and confidential computing'),
  ('Data', 'Data engineering, analytics, and pipelines'),
  ('Other', 'Other technical domains');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  bio TEXT,
  username TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create failures table
CREATE TABLE public.failures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  domain_id UUID REFERENCES public.domains(id) NOT NULL,
  title TEXT NOT NULL,
  status failure_status NOT NULL DEFAULT 'to_fail',
  verification_status verification_status NOT NULL DEFAULT 'pending',
  rejection_feedback TEXT,
  reason_for_project TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  initial_hypothesis TEXT NOT NULL,
  context_and_constraints TEXT NOT NULL,
  what_is_failing TEXT NOT NULL,
  what_was_tried TEXT NOT NULL,
  why_it_failed TEXT NOT NULL,
  who_is_relevant_for TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_failures_updated_at
  BEFORE UPDATE ON public.failures
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on all tables
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failures ENABLE ROW LEVEL SECURITY;

-- Domains policies (public read)
CREATE POLICY "Domains are viewable by everyone"
  ON public.domains FOR SELECT
  USING (true);

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- User roles policies (only admins can manage)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Failures policies
CREATE POLICY "Published failures are viewable by everyone"
  ON public.failures FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create failures"
  ON public.failures FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own failures"
  ON public.failures FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own failures"
  ON public.failures FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any failure"
  ON public.failures FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete any failure"
  ON public.failures FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));