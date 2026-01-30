import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Failure, VerificationStatus, Profile } from '@/types';

interface FailureFilters {
  domainId?: string;
  status?: 'to_fail' | 'failed';
  verificationStatus?: VerificationStatus;
  userId?: string;
}

export function useFailures(filters?: FailureFilters) {
  return useQuery({
    queryKey: ['failures', filters],
    queryFn: async () => {
      let query = supabase
        .from('failures')
        .select(`
          *,
          domain:domains(*)
        `)
        .order('created_at', { ascending: false });
      
      if (filters?.domainId) {
        query = query.eq('domain_id', filters.domainId);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.verificationStatus) {
        query = query.eq('verification_status', filters.verificationStatus);
      }
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      // Fetch profiles for each failure's user_id
      const userIds = [...new Set(data?.filter(f => f.user_id).map(f => f.user_id) || [])];
      let profilesMap: Record<string, Profile> = {};
      
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .in('user_id', userIds);
        
        profilesMap = (profiles || []).reduce((acc, p) => {
          acc[p.user_id] = p as Profile;
          return acc;
        }, {} as Record<string, Profile>);
      }
      
      return (data || []).map(failure => ({
        ...failure,
        profile: failure.user_id ? profilesMap[failure.user_id] : undefined
      })) as Failure[];
    }
  });
}

export function useFailure(id: string) {
  return useQuery({
    queryKey: ['failure', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('failures')
        .select(`
          *,
          domain:domains(*)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      // Fetch profile if user_id exists
      let profile: Profile | undefined;
      if (data.user_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user_id)
          .maybeSingle();
        profile = profileData as Profile | undefined;
      }
      
      return { ...data, profile } as Failure;
    },
    enabled: !!id
  });
}

export function useCreateFailure() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (failure: Omit<Failure, 'id' | 'created_at' | 'updated_at' | 'domain' | 'profile'>) => {
      const { data, error } = await supabase
        .from('failures')
        .insert(failure)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['failures'] });
    }
  });
}

export function useUpdateFailure() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Failure> & { id: string }) => {
      const { data, error } = await supabase
        .from('failures')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['failures'] });
      queryClient.invalidateQueries({ queryKey: ['failure', variables.id] });
    }
  });
}

export function useDeleteFailure() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('failures')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['failures'] });
    }
  });
}

// Stats hook for the landing page
export function useFailureStats() {
  return useQuery({
    queryKey: ['failure-stats'],
    queryFn: async () => {
      const [failuresResult, profilesResult, toFailResult] = await Promise.all([
        supabase.from('failures').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('failures').select('id', { count: 'exact', head: true }).eq('status', 'to_fail'),
      ]);
      
      return {
        totalFailures: failuresResult.count || 0,
        verifiedEngineers: profilesResult.count || 0,
        activeBlockers: toFailResult.count || 0,
      };
    }
  });
}
