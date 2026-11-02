'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dataStore } from '@/lib/data-store';
import { exportToCSV, exportToExcel } from '@/lib/export-utils';
import {
  FileText,
  Search,
  Filter,
  Download,
  Clock,
  ShieldCheck,
  User,
  Tag,
  AlertCircle,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { AuditLog } from '@/types/database';

export default function AdminAuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');
  const [selectedEntity, setSelectedEntity] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [, setRefreshKey] = useState(0);

  const logs = dataStore.getAuditLogs();

  const refresh = () => setRefreshKey((k) => k + 1);

  // Extract unique actions and entities for filters
  const uniqueActions = Array.from(new Set(logs.map((l) => l.action)));
  const uniqueEntities = Array.from(new Set(logs.map((l) => l.entity_type)));

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.admin_email && log.admin_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.entity_id && log.entity_id.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;
    const matchesEntity = selectedEntity === 'ALL' || log.entity_type === selectedEntity;

    return matchesSearch && matchesAction && matchesEntity;
  });

  const getActionBadgeColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'CREATE':
      case 'ENROLL':
      case 'BULK_ENROLL':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'UPDATE':
      case 'EDIT':
      case 'SAVE_RESULT':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'DELETE':
      case 'REMOVE':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'PUBLISH':
      case 'PUBLISH_RESULT':
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-slate-700/30 text-slate-300 border-slate-600/40';
    }
  };

  const handleExportCSV = () => {
    const rows = filteredLogs.map((l) => ({
      Timestamp: new Date(l.created_at).toLocaleString(),
      'Admin Email': l.admin_email,
      Action: l.action,
      'Entity Type': l.entity_type,
      'Entity ID': l.entity_id || 'N/A',
      Details: JSON.stringify(l.details),
    }));
    exportToCSV(`Audit_Log_Export_${new Date().toISOString().split('T')[0]}`, rows);
  };

  const handleExportExcel = () => {
    const rows = filteredLogs.map((l) => ({
      Timestamp: new Date(l.created_at).toLocaleString(),
      'Admin Email': l.admin_email,
      Action: l.action,
      'Entity Type': l.entity_type,
      'Entity ID': l.entity_id || 'N/A',
      Details: JSON.stringify(l.details),
    }));
    exportToExcel(`Audit_Log_Export_${new Date().toISOString().split('T')[0]}`, rows, 'AuditTrail');
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar currentRole="SUPER_ADMIN" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="System Audit Trail & Security Logs" />

        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <h1 className="text-xl font-black text-white">Administrative Audit Trail</h1>
              </div>
              <p className="text-xs text-slate-400">
                Immutable activity records for all administrative events, student modifications, score entries, and system configurations.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export Excel
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by admin, action, or entity ID..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Action Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400">Action:</span>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="ALL">All Actions ({uniqueActions.length})</option>
                {uniqueActions.map((act) => (
                  <option key={act} value={act}>
                    {act}
                  </option>
                ))}
              </select>
            </div>

            {/* Entity Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400">Entity:</span>
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="ALL">All Entities ({uniqueEntities.length})</option>
                {uniqueEntities.map((ent) => (
                  <option key={ent} value={ent}>
                    {ent}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={refresh}
              className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg border border-slate-700/60 ml-auto cursor-pointer"
              title="Refresh Logs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Log Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Recorded Operations ({filteredLogs.length})
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Sorted by most recent</span>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p className="text-xs font-bold">No audit records match your query.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-950 text-[10px] font-black uppercase text-slate-400 border-b border-slate-800 tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Operator</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Entity Type</th>
                      <th className="py-3 px-4">Entity Target ID</th>
                      <th className="py-3 px-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap text-slate-400 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(log.created_at).toLocaleString()}</span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{log.admin_email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${getActionBadgeColor(
                              log.action
                            )}`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-slate-300 font-semibold">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300">
                            {log.entity_type}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-400">
                          {log.entity_id ? log.entity_id.substring(0, 16) + '...' : 'System'}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold transition-all border border-slate-700/60 cursor-pointer"
                          >
                            <Eye className="w-3 h-3 text-amber-400" />
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Inspect Details Modal */}
          {selectedLog && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-black border ${getActionBadgeColor(
                        selectedLog.action
                      )}`}
                    >
                      {selectedLog.action}
                    </span>
                    <h3 className="text-sm font-black text-white">Audit Event Details</h3>
                  </div>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="text-slate-400 hover:text-white p-1 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Admin Account
                      </p>
                      <p className="font-semibold text-slate-200 mt-0.5">{selectedLog.admin_email}</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Timestamp
                      </p>
                      <p className="font-semibold text-slate-200 mt-0.5">
                        {new Date(selectedLog.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Entity Type
                      </p>
                      <p className="font-semibold text-slate-200 mt-0.5">{selectedLog.entity_type}</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Entity ID
                      </p>
                      <p className="font-mono text-slate-200 mt-0.5 truncate">
                        {selectedLog.entity_id || 'Global'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                      Payload Metadata
                    </p>
                    <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto max-h-60">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
