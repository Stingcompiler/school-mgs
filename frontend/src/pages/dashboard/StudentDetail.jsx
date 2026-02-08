import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import PaymentModal from '../../components/dashboard/PaymentModal';
import {
    ArrowRight, Edit, Phone, MapPin, User, BookOpen,
    CreditCard, Shirt, FileText, Plus
} from 'lucide-react';

function StudentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        loadStudent();
    }, [id]);

    const loadStudent = async () => {
        try {
            const data = await api.getStudent(id);
            setStudent(data);
        } catch (error) {
            console.error('Failed to load student:', error);
            navigate('/dashboard/students');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = (result) => {
        loadStudent();
        setShowPaymentModal(false);

        if (result.uniform_unlocked || result.books_unlocked) {
            setToast({
                type: 'success',
                message: '🎉 تم تسليم الزي والكتب! القسط الأول مدفوع'
            });
            setTimeout(() => setToast(null), 4000);
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

    const formatWhatsAppUrl = (phone) => {
        if (!phone) return '#';
        // Remove non-digit characters
        let cleanPhone = phone.replace(/\D/g, '');
        // If it starts with 0 (Sudan local), replace with 249
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '249' + cleanPhone.substring(1);
        }
        return `https://wa.me/${cleanPhone}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!student) return null;

    const paidInstallments = student.installments?.map(i => i.installment_number) || [];


    console.log(student);
    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Toast Notification */}
            {toast && (
                <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
                    {toast.message}
                </div>
            )}

            {/* Print Header */}
            <div className="hidden print:block text-center mb-6 border-b-2 border-gray-800 pb-4">
                <h1 className="text-2xl font-bold mb-2">أكاديمية ستينج الخاصة بنين - بنات</h1>
                <h2 className="text-xl font-bold mb-2">تقرير بيانات الطالب</h2>
                <div className="flex justify-between mt-2 text-sm text-gray-600 px-4">
                    <p>التاريخ: {new Date().toLocaleDateString('ar-SD')}</p>
                    <p>العام الدراسي: 2025-2026</p>
                </div>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        to="/dashboard/students"
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{student.name}</h1>
                        <p className="text-gray-500 font-mono">{student.student_code}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link
                        to={`/dashboard/students/${id}/edit`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium print:hidden"
                    >
                        <Edit className="w-4 h-4" />
                        تعديل
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium print:hidden"
                    >
                        <FileText className="w-4 h-4" />
                        طباعة
                    </button>
                    <button
                        onClick={() => setShowPaymentModal(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/30 print:hidden"
                    >
                        <CreditCard className="w-4 h-4" />
                        إضافة دفعة
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6 print:w-full">
                    {/* Personal Info Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg print:shadow-none print:border print:border-gray-300 print:p-4">
                        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2 print:text-lg">
                            <User className="w-5 h-5 text-primary-600 print:hidden" />
                            البيانات الأساسية
                        </h2>

                        {/* Print Only: Uniform & Books Status Summary */}
                        <div className="hidden print:flex gap-4 mb-4 pb-4 border-b border-gray-200">
                            <div className="flex-1 p-2 border border-gray-300 rounded text-center">
                                <p className="text-sm font-bold mb-1">حالة الزي</p>
                                <p className={`text-lg font-bold ${student.uniform_status?.is_delivered ? 'text-green-700' : 'text-gray-500'}`}>
                                    {student.uniform_status?.is_delivered ? 'تم التسليم ✓' : 'لم يتم التسليم'}
                                </p>
                            </div>
                            <div className="flex-1 p-2 border border-gray-300 rounded text-center">
                                <p className="text-sm font-bold mb-1">حالة الكتب</p>
                                <p className={`text-lg font-bold ${student.book_status?.is_delivered ? 'text-green-700' : 'text-gray-500'}`}>
                                    {student.book_status?.is_delivered ? 'تم التسليم ✓' : 'لم يتم التسليم'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">العنوان</p>
                                <p className="font-medium text-gray-800 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400 print:hidden" />
                                    {student.address || '-'}
                                </p>
                            </div>
                            <div className="print:hidden">
                                <p className="text-sm text-gray-500">ولي الأمر</p>
                                <p className="font-medium text-gray-800">{student.parent_name}</p>
                            </div>
                            <div className="print:hidden">
                                <p className="text-sm text-gray-500">هاتف ولي الأمر</p>
                                <div className="font-medium text-gray-800 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <a
                                        href={formatWhatsAppUrl(student.parent_phone)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-primary-600 transition-colors"
                                    >
                                        {student.parent_phone}
                                    </a>
                                </div>
                            </div>
                            <div className="print:hidden">
                                <p className="text-sm text-gray-500">هاتف الطالب</p>
                                <div className="font-medium text-gray-800">
                                    {student.phone ? (
                                        <a
                                            href={formatWhatsAppUrl(student.phone)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-primary-600 transition-colors flex items-center gap-2"
                                        >
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            {student.phone}
                                        </a>
                                    ) : '-'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Info Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg print:shadow-none print:border print:border-gray-300 print:p-4">
                        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2 print:text-lg">
                            <BookOpen className="w-5 h-5 text-accent-600 print:hidden" />
                            البيانات الأكاديمية
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:grid-cols-3">
                            <div className="p-4 rounded-xl bg-primary-50 print:bg-transparent print:border print:border-gray-200">
                                <p className="text-sm text-primary-600 print:text-black">الصف</p>
                                <p className="font-bold text-primary-700 text-xl print:text-black">{getLevelLabel(student.academic_level)}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-accent-50 print:bg-transparent print:border print:border-gray-200">
                                <p className="text-sm text-accent-600 print:text-black">التخصص</p>
                                <p className="font-bold text-accent-700 text-xl print:text-black">{getSpecLabel(student.specialization)}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-amber-50 print:bg-transparent print:border print:border-gray-200">
                                <p className="text-sm text-amber-600 print:text-black">الدرجة</p>
                                <p className="font-bold text-amber-700 text-xl print:text-black">{student.result?.total_score || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment History */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg print:shadow-none print:border print:border-gray-300 print:p-4">
                        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2 print:text-lg">
                            <CreditCard className="w-5 h-5 text-amber-600 print:hidden" />
                            سجل المدفوعات
                        </h2>

                        {/* Installments Progress */}
                        <div className="flex gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <div
                                    key={num}
                                    className={`flex-1 h-3 rounded-full transition-all ${paidInstallments.includes(num)
                                        ? 'gradient-primary'
                                        : 'bg-gray-200'
                                        }`}
                                />
                            ))}
                        </div>

                        <p className="text-sm text-gray-500 mb-4">
                            {paidInstallments.length} من 5 أقساط مدفوعة
                        </p>

                        {student.installments?.length > 0 ? (
                            <div className="space-y-3">
                                {student.installments.map((installment) => (
                                    <div
                                        key={installment.id}
                                        className="flex items-center justify-between p-4 rounded-xl bg-gray-50 print:bg-transparent print:border print:border-gray-200 print:p-2"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-800">القسط {installment.installment_number}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(installment.payment_date).toLocaleDateString('ar-SD')}
                                            </p>
                                        </div>
                                        <p className="font-bold text-primary-600 print:text-black">{installment.amount} ج.س</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-4">لا توجد مدفوعات بعد</p>
                        )}

                        {/* Financial Summary for Print */}
                        <div className="hidden print:block mt-6 pt-4 border-t border-gray-300">
                            <div className="flex justify-between items-center text-lg font-bold">
                                <div>
                                    <span className="text-gray-600 ml-2">إجمالي المدفوع:</span>
                                    <span>{student.total_paid} ج.س</span>
                                </div>
                                <div>
                                    <span className="text-gray-600 ml-2">المتبقي:</span>
                                    <span>{student.remaining_amount} ج.س</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6 print:hidden">
                    {/* Financial Summary */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h2 className="font-bold text-gray-800 mb-4">الملخص المالي</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">المدفوع</span>
                                <span className="font-bold text-primary-600 text-xl">{student.total_paid} ج.س</span>
                            </div>
                            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                <span className="text-gray-500">المتبقي</span>
                                <span className="font-bold text-red-500 text-xl">{student.remaining_amount} ج.س</span>
                            </div>
                        </div>
                    </div>

                    {/* Uniform Status */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Shirt className="w-5 h-5" />
                            حالة الزي
                        </h2>
                        {student.uniform_status?.is_delivered ? (
                            <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-center">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                                    <Shirt className="w-6 h-6 text-green-600" />
                                </div>
                                <p className="font-bold text-green-700">تم التسليم ✓</p>
                                <p className="text-sm text-green-600">
                                    {student.uniform_status.delivered_at
                                        ? new Date(student.uniform_status.delivered_at).toLocaleDateString('ar-SD')
                                        : ''
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                    <Shirt className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="font-medium text-gray-600">لم يتم التسليم</p>
                                <p className="text-sm text-gray-500">يتم التسليم عند دفع القسط الأول</p>
                            </div>
                        )}
                    </div>

                    {/* Book Status */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            حالة الكتب
                        </h2>
                        {student.book_status?.is_delivered ? (
                            <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-center">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                                    <BookOpen className="w-6 h-6 text-green-600" />
                                </div>
                                <p className="font-bold text-green-700">تم التسليم ✓</p>
                                <p className="text-sm text-green-600">
                                    {student.book_status.delivered_at
                                        ? new Date(student.book_status.delivered_at).toLocaleDateString('ar-SD')
                                        : ''
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                    <BookOpen className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="font-medium text-gray-600">لم يتم التسليم</p>
                                <p className="text-sm text-gray-500">يتم التسليم عند دفع القسط الأول</p>
                            </div>
                        )}
                    </div>

                    {/* Receipts */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            الإيصالات
                        </h2>
                        {student.receipts?.length > 0 ? (
                            <div className="space-y-2">
                                {student.receipts.map((receipt) => (
                                    <div
                                        key={receipt.id}
                                        className="p-3 rounded-lg bg-gray-50 text-sm"
                                    >
                                        <p className="font-mono text-gray-600 truncate">
                                            {receipt.receipt_number.slice(0, 8)}...
                                        </p>
                                        <p className="text-gray-500">
                                            {new Date(receipt.created_at).toLocaleDateString('ar-SD')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-4">لا توجد إيصالات</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <PaymentModal
                    student={student}
                    paidInstallments={paidInstallments}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
}

export default StudentDetail;
