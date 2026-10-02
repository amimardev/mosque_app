import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import api from '@/lib/apiClient';
import { 
  Users, UserPlus, Search, Phone, Mail, MapPin, 
  Edit, Trash2, GraduationCap, MessageSquare, AlertCircle, CheckCircle2, User, X
} from 'lucide-react';
import { Parent } from '../../types';
import { ParentModal } from '../../components/modals/ParentModal';

export const Route = createFileRoute('/dashboard/parents')({
  component: MasterParentsDirectoryPage,
});

function MasterParentsDirectoryPage() {
  const navigate = useNavigate();
  const [parents, setParents] = useState<Parent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParentToEdit, setSelectedParentToEdit] = useState<Parent | null>(null);

  // Custom Delete Confirm Dialog state
  const [parentToDelete, setParentToDelete] = useState<Parent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const loadParents = async () => {
    try {
      setIsLoading(true);
      const params = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
      const res = await api.get(`/api/parents${params}`);
      setParents(res.data.parents || []);
    } catch (err) {
      console.error('Failed to load parents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadParents();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadParents();
  };

  const handleOpenNewParentModal = () => {
    setSelectedParentToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditParentModal = (parent: Parent) => {
    setSelectedParentToEdit(parent);
    setIsModalOpen(true);
  };

  const handleConfirmDeleteParent = async () => {
    if (!parentToDelete) return;
    try {
      setIsDeleting(true);
      setDeleteError('');
      await api.delete(`/api/parents/${parentToDelete.id}`);
      setParentToDelete(null);
      await loadParents();
    } catch (err: any) {
      console.error('Failed to delete parent:', err);
      setDeleteError(err.response?.data?.error || err.message || 'حدث خطأ أثناء حذف ولي الأمر');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalParents = parents.length;
  const totalChildrenLinked = parents.reduce((acc, p) => acc + (p.studentsCount || 0), 0);

  return (
    <div className="space-y-6 pb-16 text-right" dir="rtl">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[11px] font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>دليل التواصل مع أولياء الأمور</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              أولياء الأمور وقنوات التواصل
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              إدارة أسماء ورقم هاتف كل ولي أمر، وربط كل ولي أمر بأبنائه المسجلين في حلقات المدرسة القرآنية.
            </p>
          </div>

          {/* Action & Stats */}
          <div className="flex items-center gap-3 flex-wrap sm:justify-end">
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl text-center min-w-[100px]">
              <span className="text-[10px] text-teal-800 font-bold block">إجمالي أولياء الأمور</span>
              <span className="text-lg font-extrabold text-teal-950 font-mono">{totalParents}</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center min-w-[100px]">
              <span className="text-[10px] text-emerald-800 font-bold block">الأبناء المسجلون</span>
              <span className="text-lg font-extrabold text-emerald-950 font-mono">{totalChildrenLinked}</span>
            </div>

            <button
              onClick={handleOpenNewParentModal}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة ولي أمر جديد</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث باسم ولي الأمر، رقم الهاتف، أو اسم الطالب الابن..."
              className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            بحث
          </button>
        </form>
      </div>

      {/* Structured Parents Cards (Mobile) & Table (Desktop) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-slate-400 text-xs font-bold">
            جاري تحميل سجل أولياء الأمور...
          </div>
        ) : parents.length > 0 ? (
          <>
            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3 p-3 sm:p-4 bg-slate-50/50">
              {parents.map((parent) => (
                <div key={parent.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3 text-right">
                  {/* Top Header: Avatar, Name & Edit/Delete actions */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0 border border-teal-200">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm">{parent.name}</h3>
                        <span className="text-[10px] text-slate-400 font-mono block">معرف: {parent.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditParentModal(parent)}
                        title="تعديل بيانات ولي الأمر"
                        className="p-2 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteError('');
                          setParentToDelete(parent);
                        }}
                        title="حذف ولي الأمر"
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Phone & WhatsApp Communication Bar */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <a
                      href={`tel:${parent.phone}`}
                      className="inline-flex items-center gap-1.5 font-mono font-bold text-slate-800 hover:text-teal-700"
                      dir="ltr"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{parent.phone}</span>
                    </a>

                    <a
                      href={`https://wa.me/${parent.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs hover:bg-emerald-200 transition-colors inline-flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>واتساب</span>
                    </a>
                  </div>

                  {/* Linked Students / Children */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 block">الأبناء المسجلون:</span>
                    {parent.students && parent.students.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {parent.students.map((st) => (
                          <Link
                            key={st.id}
                            to={`/dashboard/students/${st.id}` as any}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-800 hover:text-teal-900 transition-colors font-bold text-[11px]"
                          >
                            <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                            <span>{st.name}</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">لا يوجد أبناء مرتبطون بعد</span>
                    )}
                  </div>

                  {/* Optional Email / Address / Notes */}
                  {(parent.email || parent.address || parent.notes) && (
                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-0.5">
                      {parent.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{parent.email}</span>
                        </div>
                      )}
                      {parent.address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{parent.address}</span>
                        </div>
                      )}
                      {parent.notes && (
                        <p className="text-[10px] text-slate-500 italic mt-1">{parent.notes}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-extrabold">
                    <th className="py-3.5 px-4">ولي الأمر</th>
                    <th className="py-3.5 px-4">رقم الهاتف</th>
                    <th className="py-3.5 px-4">الأبناء المسجلون</th>
                    <th className="py-3.5 px-4">البريد والعنوان</th>
                    <th className="py-3.5 px-4">ملاحظات</th>
                    <th className="py-3.5 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parents.map((parent) => (
                    <tr key={parent.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name */}
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 border border-teal-200">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{parent.name}</p>
                            <span className="text-[10px] text-slate-400 font-mono">معرف: {parent.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${parent.phone}`}
                            className="inline-flex items-center gap-1 text-slate-800 hover:text-teal-700 hover:underline"
                          >
                            <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span dir="ltr">{parent.phone}</span>
                          </a>
                          <a
                            href={`https://wa.me/${parent.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            title="تواصل عبر واتساب"
                            className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] hover:bg-emerald-200 transition-colors"
                          >
                            واتساب
                          </a>
                        </div>
                      </td>

                      {/* Linked Students / Children */}
                      <td className="py-3.5 px-4">
                        {parent.students && parent.students.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {parent.students.map((st) => (
                              <Link
                                key={st.id}
                                to={`/dashboard/students/${st.id}` as any}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-800 hover:text-teal-900 transition-colors font-bold text-[11px]"
                              >
                                <GraduationCap className="w-3 h-3 text-teal-600" />
                                <span>{st.name}</span>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">لا يوجد أبناء مرتبطون بعد</span>
                        )}
                      </td>

                      {/* Email / Address */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div>
                          {parent.email && (
                            <span className="block text-[11px] font-medium text-slate-700">{parent.email}</span>
                          )}
                          {parent.address && (
                            <span className="block text-[10px] text-slate-500">{parent.address}</span>
                          )}
                          {!parent.email && !parent.address && (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </div>
                      </td>

                      {/* Notes */}
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {parent.notes || '-'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEditParentModal(parent)}
                            title="تعديل بيانات ولي الأمر"
                            className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteError('');
                              setParentToDelete(parent);
                            }}
                            title="حذف ولي الأمر"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="py-16 text-center space-y-3 p-6">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">لا يوجد أولياء أمور مسجلون حالياً.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              اضغط على "إضافة ولي أمر جديد" لإنشاء سجل لولي الأمر وربطه بالطلاب.
            </p>
          </div>
        )}
      </div>

      {/* Parent Modal */}
      <ParentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        parentToEdit={selectedParentToEdit}
        onSuccess={loadParents}
      />

      {/* Custom Confirm Delete Modal */}
      {parentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden text-right">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 font-bold">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    تأكيد حذف ولي الأمر
                  </h3>
                  <p className="text-xs text-slate-500">
                    إجراء غير قابل للتراجع
                  </p>
                </div>
              </div>
              <button
                onClick={() => setParentToDelete(null)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {deleteError && (
                <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{deleteError}</span>
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                هل أنت متأكد من حذف سجل ولي الأمر <strong className="text-slate-900 font-extrabold">"{parentToDelete.name}"</strong>؟
              </p>

              {parentToDelete.studentsCount && parentToDelete.studentsCount > 0 ? (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
                  <span className="font-extrabold block text-amber-950">تنبيه هام:</span>
                  <p className="leading-relaxed">
                    هذا ولي الأمر مرتبط بـ <strong className="font-mono font-bold text-amber-900">{parentToDelete.studentsCount}</strong> من الطلاب. عند الحذف سيتم إلغاء ارتباط الطلاب بولي الأمر مع الحفاظ على سجلات الطلاب.
                  </p>
                </div>
              ) : null}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setParentToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteParent}
                  disabled={isDeleting}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isDeleting ? 'جاري الحذف...' : 'نعم، تأكيد الحذف'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
