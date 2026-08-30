'use client';

import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const ADMIN_EMAILS = ['mokhtari.achref06@gmail.com', 'toumiachref21@gmail.com'];

export function useAdminRole(userId: string | undefined, userEmail: string | undefined) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      if (!userEmail && !userId) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      if (userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      if (!isSupabaseConfigured || !supabase) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      if (userId) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (!error && data?.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    }
    checkAdmin();
  }, [userId, userEmail]);

  return { isAdmin, loading };
}
