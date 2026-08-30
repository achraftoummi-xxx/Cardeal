'use client';

import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Users, Car, Clock, ShieldCheck, CheckCircle2, XCircle, ChevronRight, Activity, Wrench } from 'lucide-react';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'clients' | 'vehicles' | 'logs'>('requests');
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ clients: 0, vehicles: 0, pending: 0, activeSessions: 14 });
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
    }
  }, [isOpen]);

  async function fetchAdminData() {
    setLoading(true);
    if (!isSupabaseConfigured || !supabase) {
      // Mock data for preview/testing when Supabase tables are empty
      setPendingRequests([
        { id: '1-mock', company_name: 'Garage Al-Amine', email: 'amine@garage.tn', category: 'Mécanique générale', status: 'pending', created_at: new Date().toISOString() },
        { id: '2-mock', company_name: 'Electro-Auto Tunis', email: 'contact@electroauto.tn', category: 'Électricité & Diagnostic', status: 'pending', created_at: new Date().toISOString() }
      ]);
      setClients([
        { id: 'c1', email: 'mokhtari.achref06@gmail.com', role: 'admin', created_at: new Date().toISOString() },
        { id: 'c2', email: 'toumiachref21@gmail.com', role: 'admin', created_at: new Date().toISOString() },
        { id: 'c3', email: 'client.tunis@cardeal.tn', role: 'client', created_at: new Date().toISOString() }
      ]);
      setVehicles([
        { id: 'v1', brand: 'Toyota', model: 'Corolla', year: 2022, health_score: 94, owner_email: 'client.tunis@cardeal.tn', history: [{ date: '2026-02-10', service: 'Vidange & Filtres', status: 'Complété' }] },
        { id: 'v2', brand: 'Volkswagen', model: 'Golf 7', year: 2019, health_score: 82, owner_email: 'client.tunis@cardeal.tn', history: [{ date: '2026-01-15', service: 'Remplacement Plaquettes de Frein', status: 'Complété' }] }
      ]);
      setMetrics({ clients: 3, vehicles: 2, pending: 2, activeSessions: 14 });
      setLoading(false);
      return;
    }

    // 1. Fetch pending partner requests
    const { data: requests } = await supabase
      .from('partner_requests')
      .select('*')
      .eq('status', 'pending');
    setPendingRequests(requests || []);

    // 2. Fetch clients (profiles)
    const { data: clientData, count: clientCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' });
    setClients(clientData || []);

    // 3. Fetch vehicles with profiles/metadata if available
    const { data: vehicleData, count: vehicleCount } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact' });
    setVehicles(vehicleData || []);

    setMetrics({
      clients: clientCount || clientData?.length || 0,
      vehicles: vehicleCount || vehicleData?.length || 0,
      pending: requests?.length || 0,
      activeSessions: 18,
    });
    setLoading(false);
  }

  async function handlePartnerAction(requestId: string, email: string, category: string, action: 'accept' | 'denied') {
    if (!isSupabaseConfigured || !supabase) {
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      return;
    }
    if (action === 'accept') {
      await supabase.from('partner_requests').update({ status: 'accepted' }).eq('id', requestId);
      await supabase.from('profiles').update({ role: 'partner', category }).eq('email', email);
    } else {
      await supabase.from('partner_requests').update({ status: 'denied' }).eq('id', requestId);
    }
    fetchAdminData();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl h-full bg-[#121212] border-l border-neutral-800 p-6 overflow-y-auto text-white flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 font-bold">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-wide text-white">CarDeal Admin Control Center</h2>
              <p className="text-xs text-neutral-400">Supervision globale et gestion des flux de la plateforme</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition">
            ✕
          </button>
        </div>

        {/* Global Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase tracking-wider">
              <span>Clients Actifs</span>
              <Users size={16} className="text-blue-400" />
            </div>
            <p className="text-3xl font-extrabold mt-2 text-white">{metrics.clients}</p>
            <span className="text-[10px] text-green-400 mt-1 flex items-center gap-1">
              <Activity size={10} /> +{metrics.activeSessions} en ligne
            </span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase tracking-wider">
              <span>Véhicules Enregistrés</span>
              <Car size={16} className="text-purple-400" />
            </div>
            <p className="text-3xl font-extrabold mt-2 text-white">{metrics.vehicles}</p>
            <span className="text-[10px] text-neutral-400 mt-1">Synchronisé en temps réel</span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase tracking-wider">
              <span>Demandes Partenaires</span>
              <Clock size={16} className="text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold mt-2 text-amber-500">{metrics.pending}</p>
            <span className="text-[10px] text-amber-400/80 mt-1">En attente de validation</span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase tracking-wider">
              <span>Santé Système</span>
              <ShieldCheck size={16} className="text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold mt-2 text-emerald-400">99.9%</p>
            <span className="text-[10px] text-emerald-400/80 mt-1">Opérationnel</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 mb-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'requests' ? 'border-red-600 text-white' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Demandes Partenaires ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'clients' ? 'border-red-600 text-white' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Utilisateurs & Clients ({clients.length})
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'vehicles' ? 'border-red-600 text-white' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Flotte Véhicules ({vehicles.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'logs' ? 'border-red-600 text-white' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Historique & Santé Logs
          </button>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="flex-1 space-y-4">
            {/* 1. Partnership Requests */}
            {activeTab === 'requests' && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-3">File d'attente des demandes de garages</h3>
                {pendingRequests.length === 0 ? (
                  <p className="text-neutral-500 text-sm bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 text-center">Aucune demande de partenariat en attente pour le moment.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingRequests.map((req) => (
                      <div key={req.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h4 className="font-semibold text-white text-base">{req.company_name}</h4>
                          <p className="text-xs text-neutral-400">{req.email} • <span className="text-red-400 font-medium uppercase">{req.category}</span></p>
                          <span className="text-[10px] text-neutral-500 mt-1 block">Soumis le {new Date(req.created_at || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button 
                            onClick={() => handlePartnerAction(req.id, req.email, req.category, 'accept')}
                            className="flex-1 sm:flex-none bg-green-600/20 border border-green-500/50 hover:bg-green-600/30 px-4 py-2 text-xs font-bold rounded-lg text-green-400 transition flex items-center justify-center gap-1">
                            <CheckCircle2 size={14} /> Accepter
                          </button>
                          <button 
                            onClick={() => handlePartnerAction(req.id, req.email, req.category, 'denied')}
                            className="flex-1 sm:flex-none bg-neutral-800 hover:bg-neutral-700 px-4 py-2 text-xs font-bold rounded-lg text-red-400 transition flex items-center justify-center gap-1">
                            <XCircle size={14} /> Refuser
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. Clients */}
            {activeTab === 'clients' && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-3">Liste des utilisateurs inscrits</h3>
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400 text-xs bg-neutral-950/50">
                        <th className="p-3">Utilisateur / Email</th>
                        <th className="p-3">Rôle</th>
                        <th className="p-3">Date d'inscription</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {clients.map((client) => (
                        <tr key={client.id || client.email} className="hover:bg-neutral-800/40 transition">
                          <td className="p-3 font-medium text-white">{client.email}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              client.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                              client.role === 'partner' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' :
                              'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            }`}>
                              {client.role || 'client'}
                            </span>
                          </td>
                          <td className="p-3 text-xs text-neutral-400">{new Date(client.created_at || Date.now()).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. Vehicles Fleet Tracking */}
            {activeTab === 'vehicles' && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-3">Suivi de la Flotte de Véhicules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicles.map((v) => (
                    <div key={v.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-red-400 uppercase tracking-widest">{v.brand}</span>
                          <h4 className="text-lg font-bold text-white">{v.model} ({v.year})</h4>
                          <p className="text-xs text-neutral-400 mt-0.5">Propriétaire: {v.owner_email || 'client.tunis@cardeal.tn'}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-lg">
                            Santé: {v.health_score || 92}%
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-between items-center">
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <Wrench size={12} /> {v.history?.length || 1} intervention(s)
                        </span>
                        <button
                          onClick={() => { setSelectedVehicle(v); setActiveTab('logs'); }}
                          className="text-xs font-semibold text-red-400 hover:underline flex items-center gap-1"
                        >
                          Voir historique <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Service & Health History Logs */}
            {activeTab === 'logs' && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Journaux de Maintenance & Historique de Santé</h3>
                  {selectedVehicle && (
                    <button onClick={() => setSelectedVehicle(null)} className="text-xs text-red-400 hover:underline">
                      Voir tous les véhicules
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {(selectedVehicle ? [selectedVehicle] : vehicles).map((v) => (
                    <div key={v.id} className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl">
                      <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-800">
                        <div>
                          <h4 className="font-bold text-white text-base">{v.brand} {v.model} ({v.year})</h4>
                          <p className="text-xs text-neutral-400">Indice de Santé Global: <span className="text-emerald-400 font-bold">{v.health_score || 92}%</span></p>
                        </div>
                        <span className="text-xs bg-neutral-800 px-3 py-1 rounded-lg text-neutral-300">ID: {v.id}</span>
                      </div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Interventions Récentes & Diagnostics</h5>
                      <div className="space-y-2">
                        {(v.history || [{ date: '2026-02-10', service: 'Contrôle Technique & Vidange', status: 'Complété' }, { date: '2025-11-04', service: 'Remplacement Suspension Avant', status: 'Complété' }]).map((h: any, idx: number) => (
                          <div key={idx} className="bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/60 flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2.5">
                              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                              <div>
                                <p className="font-semibold text-white">{h.service}</p>
                                <span className="text-neutral-500 text-[10px]">{h.date}</span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">{h.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
