'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Download,
  Upload,
  Edit2,
  Trash2,
  ArrowRightLeft,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dataStore } from '@/lib/data-store';
import { Student, Team } from '@/types/database';
import { exportToCSV, exportToExcel } from '@/lib/export-utils';

export default function StudentsManagementPage() {
  const [mounted, setMounted] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('ALL');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [transferringStudent, setTransferringStudent] = useState<Student | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importCsvText, setImportCsvText] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    student_id: '',
    full_name: '',
    class_grade: '3rd Year',
    course: 'B.Sc Computer Science',
    department: 'Computer Science',
    team_id: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    email: '',
    phone: '',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const festival = dataStore.getActiveFestival();

  const refreshData = () => {
    setStudents(dataStore.getStudents());
    const tList = dataStore.getTeams();
    setTeams(tList);
    if (tList.length > 0 && !formData.team_id) {
      setFormData((prev) => ({ ...prev, team_id: tList[0].id }));
    }
  };

  useEffect(() => {
    setMounted(true);
    refreshData();
  }, []);

  const openAddModal = () => {
    const nextId = dataStore.generateNextStudentId(festival.year);
    setFormData({
      student_id: nextId,
      full_name: '',
      class_grade: '3rd Year',
      course: 'B.Sc Computer Science',
      department: 'Computer Science',
      team_id: teams[0]?.id || '',
      gender: 'MALE',
      email: '',
      phone: '',
    });
    setEditingStudent(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (st: Student) => {
    setEditingStudent(st);
    setFormData({
      student_id: st.student_id,
      full_name: st.full_name,
      class_grade: st.class_grade,
      course: st.course,
      department: st.department,
      team_id: st.team_id,
      gender: st.gender || 'MALE',
      email: st.email || '',
      phone: st.phone || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        dataStore.updateStudent(editingStudent.id, {
          full_name: formData.full_name,
          class_grade: formData.class_grade,
          course: formData.course,
          department: formData.department,
          gender: formData.gender,
          email: formData.email,
          phone: formData.phone,
        });
        setMessage({ type: 'success', text: `Student ${formData.full_name} updated successfully.` });
      } else {
        dataStore.addStudent({
          festival_id: festival.id,
          student_id: formData.student_id,
          full_name: formData.full_name,
          class_grade: formData.class_grade,
          course: formData.course,
          department: formData.department,
          team_id: formData.team_id,
          gender: formData.gender,
          email: formData.email || null,
          phone: formData.phone || null,
        });
        setMessage({ type: 'success', text: `Student ${formData.full_name} enrolled successfully.` });
      }
      setIsAddModalOpen(false);
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  const handleDeleteStudent = (st: Student) => {
    if (!confirm(`Are you sure you want to delete ${st.full_name} (${st.student_id})?`)) return;
    try {
      dataStore.deleteStudent(st.id);
      setMessage({ type: 'success', text: `Student ${st.full_name} deleted.` });
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Deletion failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  const handleTransfer = (newTeamId: string) => {
    if (!transferringStudent) return;
    try {
      dataStore.transferStudent(transferringStudent.id, newTeamId);
      setMessage({
        type: 'success',
        text: `Transferred ${transferringStudent.full_name} to new team.`,
      });
      setTransferringStudent(null);
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transfer failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  const handleExportCSV = () => {
    const rows = students.map((s) => ({
      'Student ID': s.student_id,
      'Full Name': s.full_name,
      'Class / Year': s.class_grade,
      'Course': s.course,
      'Department': s.department,
      'Assigned Team': s.team?.name || '',
      'Team Code': s.team?.code || '',
      'Gender': s.gender || '',
      'Email': s.email || '',
      'Phone': s.phone || '',
    }));
    exportToCSV(`Victoria_College_Students_${festival.year}`, rows);
  };

  const handleExportExcel = () => {
    const rows = students.map((s) => ({
      'Student ID': s.student_id,
      'Full Name': s.full_name,
      'Class / Year': s.class_grade,
      'Course': s.course,
      'Department': s.department,
      'Assigned Team': s.team?.name || '',
      'Gender': s.gender || '',
      'Email': s.email || '',
      'Phone': s.phone || '',
    }));
    exportToExcel(`Victoria_College_Students_${festival.year}`, rows, 'Students');
  };

  const handleImportCSV = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const lines = importCsvText.trim().split('\n');
      if (lines.length <= 1) {
        throw new Error('Please enter a valid CSV string with header and rows.');
      }
      const newStudents: Array<Omit<Student, 'id' | 'created_at' | 'updated_at'>> = [];
      const header = lines[0].split(',').map((h) => h.trim().toLowerCase());

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
        if (!row[0]) continue;

        const rowObj: Record<string, string> = {};
        header.forEach((h, idx) => {
          rowObj[h] = row[idx] || '';
        });

        const fullName = rowObj['full name'] || rowObj['name'] || rowObj['fullname'] || `Student ${i}`;
        const sId = rowObj['student id'] || rowObj['id'] || dataStore.generateNextStudentId(festival.year);
        const course = rowObj['course'] || 'General Degree';
        const dept = rowObj['department'] || 'General';
        const classGrade = rowObj['class'] || rowObj['year'] || '2nd Year';
        const teamCode = (rowObj['team'] || rowObj['team code'] || '').toUpperCase();
        const matchedTeam = teams.find((t) => t.code === teamCode || t.name.toLowerCase() === teamCode.toLowerCase()) || teams[0];

        newStudents.push({
          festival_id: festival.id,
          student_id: sId,
          full_name: fullName,
          class_grade: classGrade,
          course: course,
          department: dept,
          team_id: matchedTeam?.id || teams[0].id,
          gender: 'MALE',
          email: rowObj['email'] || null,
          phone: rowObj['phone'] || null,
        });
      }

      const res = dataStore.importStudents(newStudents);
      setMessage({
        type: 'success',
        text: `Import complete: ${res.success} imported, ${res.skipped} skipped (duplicates).`,
      });
      setIsImportModalOpen(false);
      setImportCsvText('');
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Import failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  if (!mounted) return null;

  // Department filters
  const departments = Array.from(new Set(students.map((s) => s.department))).sort();

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTeam = selectedTeam === 'ALL' || s.team_id === selectedTeam;
    const matchesDept = selectedDept === 'ALL' || s.department === selectedDept;

    return matchesSearch && matchesTeam && matchesDept;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar currentRole="SUPER_ADMIN" />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Student Directory & Roster"
          description="Manage institutional student profiles, team assignments, and secure enrollment records"
        />

        <main className="flex-1 p-6 md:p-8 space-y-6">
          {/* Notifications */}
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
              <h2 className="text-xl font-extrabold text-white">Registered Students</h2>
              <p className="text-xs text-slate-400">Total {students.length} verified college participants</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Student
              </button>

              <button
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-teal-400" />
                Import CSV
              </button>

              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                Export Excel
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                CSV
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name, ID, course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>

            <div>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-medium"
              >
                <option value="ALL">All Contesting Teams</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-medium"
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Table */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Class / Course</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Team</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-teal-400">
                        {st.student_id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {st.full_name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {st.class_grade} • {st.course}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {st.department}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border"
                          style={{
                            borderColor: `${st.team?.color}40`,
                            backgroundColor: `${st.team?.color}15`,
                            color: st.team?.color,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: st.team?.color }}
                          />
                          {st.team?.name || 'Unassigned'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {st.phone || st.email || '–'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setTransferringStudent(st)}
                            title="Transfer Student to Another Team"
                            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-teal-400 hover:border-teal-500/40 transition-all"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(st)}
                            title="Edit Student Profile"
                            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-blue-400 hover:border-blue-500/40 transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(st)}
                            title="Delete Student Record"
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

            {filteredStudents.length === 0 && (
              <div className="p-12 text-center text-slate-400 text-xs">
                No students found matching current filters.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ========================================================
          ADD / EDIT STUDENT MODAL
          ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">
                {editingStudent ? 'Edit Student Details' : 'Enroll New Student'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Generated Student ID</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingStudent}
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Assigned Team</label>
                  <select
                    disabled={!!editingStudent}
                    value={formData.team_id}
                    onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 disabled:opacity-60"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diya Lakshmi"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Class / Year</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3rd Year"
                    value={formData.class_grade}
                    onChange={(e) => setFormData({ ...formData, class_grade: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Course</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Sc Physics"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Department</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="student@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Mobile Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="9847000000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold uppercase tracking-wider"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          TRANSFER STUDENT MODAL
          ======================================================== */}
      {transferringStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">Transfer Student</h3>
              <button onClick={() => setTransferringStudent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-300">
                Transfer <strong className="text-white">{transferringStudent.full_name}</strong> ({transferringStudent.student_id}) from current team <strong className="text-teal-400">{transferringStudent.team?.name}</strong>.
              </p>
              <p className="text-[11px] text-slate-400">
                Note: This will also automatically update team affiliations on all individual event registrations for this student.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-300">Select Destination Team:</label>
              <div className="space-y-2">
                {teams
                  .filter((t) => t.id !== transferringStudent.team_id)
                  .map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTransfer(t.id)}
                      className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 flex items-center justify-between text-xs font-bold transition-all text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                        <span className="text-white">{t.name}</span>
                      </div>
                      <span className="text-teal-400">Assign →</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          IMPORT CSV MODAL
          ======================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">Import Students from CSV</h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImportCSV} className="space-y-3 text-xs">
              <p className="text-slate-300">
                Paste your CSV content below. Required columns: <code className="text-teal-400">Full Name, Course, Department, Class, Team</code>
              </p>

              <textarea
                rows={8}
                required
                placeholder={`Full Name,Course,Department,Class,Team\nAnjali V,B.A. English,English,2nd Year,RUBY\nRohan P,B.Com,Commerce,3rd Year,EMERALD`}
                value={importCsvText}
                onChange={(e) => setImportCsvText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-slate-200 text-xs focus:outline-none focus:border-teal-500"
              />

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold uppercase tracking-wider"
                >
                  Start Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

