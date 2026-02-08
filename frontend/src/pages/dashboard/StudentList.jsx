import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { Search, Plus, Eye, Trash2, Filter, ChevronRight, ChevronLeft } from 'lucide-react';
import ConfirmDialog from '../../components/common/ConfirmDialog';

function StudentList() {
    // 1. Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10); // Adjust this number as needed

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [specFilter, setSpecFilter] = useState('');

    // 2. Reset page to 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, levelFilter, specFilter]);

    // 3. Load students when page or filters change
    useEffect(() => {
        loadStudents();
    }, [currentPage, search, levelFilter, specFilter]); // Added currentPage dependency

    const loadStudents = async () => {
        setLoading(true); // Ensure loading state triggers on page change
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage, // Send limit to backend
            };

            if (search) params.search = search;
            if (levelFilter) params.level = levelFilter;
            if (specFilter) params.specialization = specFilter;

            const response = await api.getStudents(params);

            // 4. Handle Response
            // NOTE: This assumes your API returns { results: [], count: 100 }
            // If your API returns just an array, you'll need to adjust this.
            if (response.results) {
                setStudents(response.results);
                setTotalPages(Math.ceil(response.count / itemsPerPage));
            } else {
                // Fallback if API is not yet paginated (handles raw array)
                setStudents(response);
                setTotalPages(1);
            }

        } catch (error) {
            console.error('Failed to load students:', error);
        } finally {
            setLoading(false);
        }
    };

    // Confirm Dialog State
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        studentId: null,
    });

    // Toast State
    const [toast, setToast] = useState(null);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const handleDeleteClick = (id) => {
        setConfirmDialog({
            isOpen: true,
            studentId: id,
        });
    };

    const handleConfirmDelete = async () => {
        const id = confirmDialog.studentId;
        if (!id) return;

        try {
            await api.deleteStudent(id);
            showToast('success', 'تم حذف الطالب بنجاح');
            // Reload current page
            loadStudents();
        } catch (error) {
            console.error('Failed to delete student:', error);
            showToast('error', 'فشل حذف الطالب');
        } finally {
            setConfirmDialog({ isOpen: false, studentId: null });
        }
    };

    const getLevelLabel = (level) => {
        const labels = { 1: 'الأول', 2: 'الثاني', 3: 'الثالث' };
        return labels[level] || level;
    };

    const getSpecLabel = (spec) => {
        const labels = { 'Sci': 'علمي', 'Lit': 'أدبي', 'Gen': 'عام' };
        return labels[spec] || spec;
    };

    // Pagination Handlers
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Toast Notification */}
            {toast && (
                <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
                    {toast.message}
                </div>
            )}

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                onConfirm={handleConfirmDelete}
                title="حذف الطالب"
                message="هل أنت متأكد من رغبتك في حذف هذا الطالب؟ لا يمكن التراجع عن هذا الإجراء."
                isDestructive={true}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">الطلاب</h1>
                    <p className="text-gray-500">إدارة بيانات الطلاب</p>
                </div>
                <Link
                    to="/dashboard/students/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/30"
                >
                    <Plus className="w-5 h-5" />
                    إضافة طالب
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="بحث عن طالب..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                        />
                    </div>

                    {/* Level Filter */}
                    <select
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    >
                        <option value="">جميع الصفوف</option>
                        <option value="1">الصف الأول</option>
                        <option value="2">الصف الثاني</option>
                        <option value="3">الصف الثالث</option>
                    </select>

                    {/* Specialization Filter */}
                    <select
                        value={specFilter}
                        onChange={(e) => setSpecFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    >
                        <option value="">جميع التخصصات</option>
                        <option value="Gen">عام</option>
                        <option value="Sci">علمي</option>
                        <option value="Lit">أدبي</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col min-h-[600px]">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                    </div>
                ) : students.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-16">
                        <p className="text-gray-500 mb-4">لا يوجد طلاب مطابقين للبحث</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الكود</th>
                                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الاسم</th>
                                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الصف</th>
                                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">التخصص</th>
                                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">النتيجة</th>
                                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">المدفوع</th>
                                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الزي</th>
                                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {students.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-mono text-gray-600">{student.student_code}</td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-800">{student.name}</p>
                                                <p className="text-sm text-gray-500">{student.parent_name}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                                                    {getLevelLabel(student.academic_level)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${student.specialization === 'Sci'
                                                    ? 'bg-accent-100 text-accent-700'
                                                    : student.specialization === 'Lit'
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {getSpecLabel(student.specialization)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-gray-700">{student.total_score || '-'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-primary-600">{student.total_paid} ج.س</p>
                                                <p className="text-sm text-gray-500">المتبقي: {student.remaining_amount}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {student.uniform_delivered ? (
                                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                                        مسلم ✓
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                                                        غير مسلم
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        to={`/dashboard/students/${student.id}`}
                                                        className="p-2 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(student.id)}
                                                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="border-t border-gray-100 p-4 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <span className="text-sm text-gray-500">
                                صفحة {currentPage} من {totalPages}
                            </span>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" /> {/* Right arrow for previous in RTL */}
                                </button>

                                <div className="hidden sm:flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        // Only show first, last, and current surrounding pages to avoid clutter
                                        (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) && (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ))}
                                </div>

                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" /> {/* Left arrow for next in RTL */}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default StudentList;