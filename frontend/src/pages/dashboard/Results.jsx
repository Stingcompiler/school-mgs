import { useState, useEffect } from 'react';
import api from '../../api';
import { FileText, Save, AlertCircle, Plus, ChevronDown, ChevronUp, CloudCog } from 'lucide-react';

function Results() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedStudent, setExpandedStudent] = useState(null);
    const [newSubject, setNewSubject] = useState({ name: '', score: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const data = await api.getStudents();
            setStudents(data);
        } catch (error) {
            console.error('Failed to load students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubject = async (studentId) => {
        if (!newSubject.name || !newSubject.score) return;

        setSaving(true);
        setMessage(null);

        try {
            await api.addSubjectResult(studentId, newSubject.name, Number(newSubject.score));
            setMessage({ type: 'success', text: 'تم تسجيل الدرجة بنجاح' });
            setNewSubject({ name: '', score: '' });
            loadStudents(); // Reload to update total and list
        } catch (error) {
            setMessage({ type: 'error', text: 'فشل حفظ الدرجة' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const toggleExpand = (id) => {
        setExpandedStudent(expandedStudent === id ? null : id);
        setNewSubject({ name: '', score: '' });
        setMessage(null);
    };

    const getLevelLabel = (level) => {
        const labels = { 1: 'الأول', 2: 'الثاني', 3: 'الثالث' };
        return labels[level] || level;
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">النتائج</h1>
                <p className="text-gray-500">إدارة درجات المواد للطلاب</p>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                    ? 'bg-green-50 border border-green-100 text-green-600'
                    : 'bg-red-50 border border-red-100 text-red-600'
                    }`}>
                    {message.type === 'error' && <AlertCircle className="w-5 h-5" />}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Results Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-accent-600" />
                        سجل الدرجات
                    </h2>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                    </div>
                ) : students.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500">لا يوجد طلاب</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {students.map((student) => (
                            <div key={student.id} className="group">
                                {/* Student Row */}
                                <div
                                    className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => toggleExpand(student.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg transition-colors ${expandedStudent === student.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {expandedStudent === student.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{student.name}</p>
                                            <p className="text-sm text-gray-500 font-mono">{student.student_code}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                                            {getLevelLabel(student.academic_level)}
                                        </span>
                                        <div className="text-left">
                                            <p className="text-xs text-gray-500">المجموع الكلي</p>
                                            <p className="font-bold text-primary-600 text-lg">{student.result?.total_score || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Detail (Subjects) */}
                                {expandedStudent === student.id && (
                                    <div className="bg-gray-50 p-6 border-t border-gray-100">
                                        <div className="max-w-3xl mx-auto space-y-4">

                                            {/* List of existing subjects */}
                                            {student.result?.subjects?.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                                    {student.result.subjects.map(sub => (
                                                        <div key={sub.id} className="bg-white p-3 rounded-xl border border-gray-200 flex justify-between items-center">
                                                            <span className="font-medium text-gray-700">{sub.subject_name}</span>
                                                            <span className="font-bold text-primary-600">{sub.score}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-center text-gray-400 py-2">لا توجد مواد مسجلة</p>
                                            )}

                                            {/* Add New Subject Form */}
                                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                                <input
                                                    type="text"
                                                    placeholder="اسم المادة (مثال: رياضيات)"
                                                    value={newSubject.name}
                                                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                                                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="الدرجة"
                                                    value={newSubject.score}
                                                    onChange={(e) => setNewSubject({ ...newSubject, score: e.target.value })}
                                                    className="w-full sm:w-32 px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                                                />
                                                <button
                                                    onClick={() => handleAddSubject(student.id)}
                                                    disabled={saving || !newSubject.name || !newSubject.score}
                                                    className="px-6 py-2 rounded-xl gradient-primary text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    {saving ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Plus className="w-5 h-5" />}
                                                    <span>إضافة</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Results;
