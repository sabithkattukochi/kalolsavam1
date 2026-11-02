'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Users,
  Award,
  UserCheck,
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dataStore } from '@/lib/data-store';
import { FestivalEvent, Category } from '@/types/database';
import { formatDate } from '@/lib/utils';

export default function EventsManagementPage() {
  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState<FestivalEvent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<FestivalEvent | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category_id: '',
    description: '',
    event_type: 'INDIVIDUAL' as 'INDIVIDUAL' | 'GROUP',
    min_participants: 1,
    max_participants: 1,
    date: '',
    start_time: '10:00 AM',
    end_time: '12:00 PM',
    venue: 'Main Auditorium',
    stage_number: 'Stage 1',
    coordinator_name: '',
    coordinator_phone: '',
    rules: '',
    status: 'SCHEDULED' as 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const festival = dataStore.getActiveFestival();

  const refreshData = () => {
    setEvents(dataStore.getEvents());
    const cList = dataStore.getCategories();
    setCategories(cList);
    if (cList.length > 0 && !formData.category_id) {
      setFormData((prev) => ({ ...prev, category_id: cList[0].id }));
    }
  };

  useEffect(() => {
    setMounted(true);
    refreshData();
    setFormData((prev) => ({
      ...prev,
      date: new Date().toISOString().split('T')[0],
    }));
  }, []);

  const openAddModal = () => {
    setEditingEvent(null);
    setFormData({
      code: `EV-${String(events.length + 1).padStart(2, '0')}`,
      name: '',
      category_id: categories[0]?.id || '',
      description: '',
      event_type: 'INDIVIDUAL',
      min_participants: 1,
      max_participants: 1,
      date: new Date().toISOString().split('T')[0],
      start_time: '10:00 AM',
      end_time: '12:00 PM',
      venue: 'Main Auditorium',
      stage_number: 'Stage 1',
      coordinator_name: '',
      coordinator_phone: '',
      rules: '',
      status: 'SCHEDULED',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ev: FestivalEvent) => {
    setEditingEvent(ev);
    setFormData({
      code: ev.code,
      name: ev.name,
      category_id: ev.category_id,
      description: ev.description || '',
      event_type: ev.event_type,
      min_participants: ev.min_participants,
      max_participants: ev.max_participants,
      date: ev.date,
      start_time: ev.start_time,
      end_time: ev.end_time,
      venue: ev.venue,
      stage_number: ev.stage_number || 'Stage 1',
      coordinator_name: ev.coordinator_name || '',
      coordinator_phone: ev.coordinator_phone || '',
      rules: ev.rules || '',
      status: ev.status,
    });
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        dataStore.updateEvent(editingEvent.id, {
          name: formData.name,
          category_id: formData.category_id,
          description: formData.description || null,
          event_type: formData.event_type,
          min_participants: Number(formData.min_participants),
          max_participants: Number(formData.max_participants),
          date: formData.date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          venue: formData.venue,
          stage_number: formData.stage_number || null,
          coordinator_name: formData.coordinator_name || null,
          coordinator_phone: formData.coordinator_phone || null,
          rules: formData.rules || null,
          status: formData.status,
        });
        setMessage({ type: 'success', text: `Event ${formData.name} updated successfully.` });
      } else {
        dataStore.addEvent({
          festival_id: festival.id,
          category_id: formData.category_id,
          code: formData.code.toUpperCase(),
          name: formData.name,
          description: formData.description || null,
          event_type: formData.event_type,
          min_participants: Number(formData.min_participants),
          max_participants: Number(formData.max_participants),
          date: formData.date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          venue: formData.venue,
          stage_number: formData.stage_number || null,
          coordinator_name: formData.coordinator_name || null,
          coordinator_phone: formData.coordinator_phone || null,
          rules: formData.rules || null,
          status: formData.status,
        });
        setMessage({ type: 'success', text: `Event ${formData.name} created.` });
      }
      setIsModalOpen(false);
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  const handleDeleteEvent = (ev: FestivalEvent) => {
    if (!confirm(`Are you sure you want to delete event "${ev.name}" (${ev.code})?`)) return;
    try {
      dataStore.deleteEvent(ev.id);
      setMessage({ type: 'success', text: `Event ${ev.name} deleted.` });
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Deletion failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  if (!mounted) return null;

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || ev.category_id === selectedCategory;
    const matchesType = selectedType === 'ALL' || ev.event_type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar currentRole="SUPER_ADMIN" />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Events Directory & Catalog"
          description="Create and manage individual and group competitions, stages, schedules, and coordinators"
        />

        <main className="flex-1 p-6 md:p-8 space-y-6">
          {message && (
            <div
              className={`p-4 rounded-2xl flex items-center justify-between border ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>{message.text}</span>
              </div>
              <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">Event Catalog</h2>
              <p className="text-xs text-slate-400">Total {events.length} competitions listed</p>
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </button>
          </div>

          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events by name, code, venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="ALL">All Event Types</option>
                <option value="INDIVIDUAL">Individual Solo</option>
                <option value="GROUP">Group Squad</option>
              </select>
            </div>
          </div>

          {/* Events Table */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Event Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Timing & Venue</th>
                    <th className="py-3 px-4 text-center">Enrolled</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredEvents.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        {ev.code}
                      </td>
                      <td className="py-3.5 px-4">
                        <strong className="text-white font-bold block">{ev.name}</strong>
                        {ev.coordinator_name && (
                          <span className="text-[10px] text-slate-400">
                            Coord: {ev.coordinator_name}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {ev.category?.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                          {ev.event_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <div>
                          {ev.start_time} - {ev.end_time}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {ev.venue} ({formatDate(ev.date)})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          href={`/admin/enrollments?eventId=${ev.id}`}
                          className="inline-flex items-center gap-1 font-bold text-amber-400 hover:underline"
                        >
                          <Users className="w-3 h-3" />
                          {ev.registrations_count || 0}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                            ev.status === 'COMPLETED'
                              ? 'bg-slate-800 text-slate-400 border-slate-700'
                              : ev.status === 'ONGOING'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          {ev.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/enrollments?eventId=${ev.id}`}
                            title="Enroll Participants"
                            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/admin/results?eventId=${ev.id}`}
                            title="Enter Results"
                            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
                          >
                            <Award className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => openEditModal(ev)}
                            title="Edit Event"
                            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-blue-400 hover:border-blue-500/40 transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(ev)}
                            title="Delete Event"
                            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredEvents.length === 0 && (
              <div className="p-12 text-center text-slate-400 text-xs">
                No events found matching current criteria.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CREATE / EDIT EVENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">
                {editingEvent ? 'Edit Event Details' : 'Create New Competition'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Event Code</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingEvent}
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 uppercase font-bold disabled:opacity-60"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="font-bold text-slate-300">Event Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Classical Music Solo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Competition Type</label>
                  <select
                    value={formData.event_type}
                    onChange={(e) => {
                      const type = e.target.value as 'INDIVIDUAL' | 'GROUP';
                      setFormData({
                        ...formData,
                        event_type: type,
                        min_participants: type === 'GROUP' ? 4 : 1,
                        max_participants: type === 'GROUP' ? 6 : 1,
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="INDIVIDUAL">Individual Solo</option>
                    <option value="GROUP">Group Squad</option>
                  </select>
                </div>
              </div>

              {formData.event_type === 'GROUP' && (
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Min Squad Members</label>
                    <input
                      type="number"
                      min={2}
                      value={formData.min_participants}
                      onChange={(e) => setFormData({ ...formData, min_participants: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Max Squad Members</label>
                    <input
                      type="number"
                      min={2}
                      value={formData.max_participants}
                      onChange={(e) => setFormData({ ...formData, max_participants: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Start Time</label>
                  <input
                    type="text"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">End Time</label>
                  <input
                    type="text"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Venue</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Main Auditorium"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Stage / Room</label>
                  <input
                    type="text"
                    placeholder="e.g. Stage 1"
                    value={formData.stage_number}
                    onChange={(e) => setFormData({ ...formData, stage_number: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Coordinator Name</label>
                  <input
                    type="text"
                    placeholder="Faculty coordinator"
                    value={formData.coordinator_name}
                    onChange={(e) => setFormData({ ...formData, coordinator_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Coordinator Phone</label>
                  <input
                    type="tel"
                    placeholder="9847000000"
                    value={formData.coordinator_phone}
                    onChange={(e) => setFormData({ ...formData, coordinator_phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Event Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="ONGOING">Ongoing (Live)</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Competition Rules & Criteria</label>
                <textarea
                  rows={3}
                  placeholder="Duration limits, materials, accompaniment guidelines..."
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold uppercase tracking-wider"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

