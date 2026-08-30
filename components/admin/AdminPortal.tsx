'use client';

import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ clients: 0, vehicles: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
    }
  }, [isOpen]);

  async function fetchAdminData() {
    setLoading(true);
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // Fetch pending partner requests
    const { data: requests } = await supabase
      .from('partner_requests')
      .select('*')
      .eq('status', 'pending');
      
    setPendingRequests(requests || []);

    // Fetch basic platform metrics counts
    const { count: clientCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client');
    const { count: vehicleCount } = await supabase.from('vehicles').select('*', { count: 'exact', head: true });

    setMetrics({
      clients: clientCount || 0,
      vehicles: vehicleCount || 0,
      pending: requests?.length || 0,
    });
    setLoading(false);
  }

  async function handlePartnerAction(requestId: string, email: string, companyName: string, category: string, action: 'accept' | 'denied') {
    if (!supabase) return;
    if (action === 'accept') {
      // Update request status and assign partner role
      await supabase.from('partner_requests').update({ status: 'accepted' }).eq('id', requestId);
      // Update target profile role
      await supabase.from('profiles').update({ role: 'partner', category }).eq('email', email);
    } else {
      await supabase.from('partner_requests').update({ status: 'denied' }).eq('id', requestId);
    }
    fetchAdminData();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl h-full bg-[#121212] border-l border-neutral-800 p-6 overflow-y-auto text-white flex flex-col">
        <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
          <h2 className="text-xl font-bold tracking-wide text-red-500">CarDeal Admin Portal</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white text-xl">✕</button>
        </div>

        {/* Global Metrics Cards */}
        <div className="grid grid-cols-3 gap-4 my-6">
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
            <p className="text-neutral-400 text-sm">Total Clients</p>
            <p className="text-2xl font-bold mt-1">{metrics.clients}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
            <p className="text-neutral-400 text-sm">Registered Vehicles</p>
            <p className="text-2xl font-bold mt-1">{metrics.vehicles}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
            <p className="text-neutral-400 text-sm">Pending Requests</p>
            <p className="text-2xl font-bold mt-1 text-amber-500">{metrics.pending}</p>
          </div>
        </div>

        {/* Partnership Requests Section */}
        <h3 className="text-lg font-semibold mb-3">Pending Partnership Requests</h3>
        {loading ? (
          <p className="text-neutral-400">Loading data...</p>
        ) : pendingRequests.length === 0 ? (
          <p className="text-neutral-500 text-sm bg-neutral-900/50 p-4 rounded border border-neutral-800/50">No pending partnership requests right now.</p>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div key={req.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-white">{req.company_name}</h4>
                  <p className="text-xs text-neutral-400">{req.email} • <span className="text-red-400 uppercase">{req.category}</span></p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handlePartnerAction(req.id, req.email, req.company_name, req.category, 'accept')}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1.5 text-xs font-semibold rounded text-white transition">
                    Accept
                  </button>
                  <button 
                    onClick={() => handlePartnerAction(req.id, req.email, req.company_name, req.category, 'denied')}
                    className="bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-xs font-semibold rounded text-red-400 transition">
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
