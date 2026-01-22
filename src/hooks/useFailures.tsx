import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Failure, VerificationStatus } from '@/types';

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
          domain:domains(*),
          profile:profiles(*)
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
      return data as Failure[];
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
          domain:domains(*),
          profile:profiles(*)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Failure | null;
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
