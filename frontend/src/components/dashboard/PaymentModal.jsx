import { useState } from 'react';
import { X, CreditCard, AlertCircle } from 'lucide-react';
import api from '../../api';

function PaymentModal({ student, paidInstallments, onClose, onSuccess }) {
    const [selectedInstallment, setSelectedInstallment] = useState(null);
    const [amount, setAmount] = useState(100000);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const availableInstallments = [1, 2, 3, 4, 5].filter(
        num => !paidInstallments.includes(num)
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedInstallment) {
            setError('الرجاء اختيار رقم القسط');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const result = await api.createPayment(student.id, selectedInstallment, amount);
            onSuccess(result);
        } catch (err) {
            setError(err.message || 'فشل تسجيل الدفعة');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800">إضافة دفعة</h2>
                            <p className="text-sm text-gray-500">{student.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {availableInstallments.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="w-8 h-8 text-green-600" />
                            </div>
                            <p className="font-bold text-green-700">تم دفع جميع الأقساط ✓</p>
                            <p className="text-gray-500 mt-2">لا توجد أقساط متبقية لهذا الطالب</p>
                        </div>
                    ) : (
                        <>
                            {/* Installment Selection */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-3">اختر رقم القسط</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {[1, 2, 3, 4, 5].map((num) => {
                                        const isPaid = paidInstallments.includes(num);
                                        const isSelected = selectedInstallment === num;

                                        return (
                                            <button
                                                key={num}
                                                type="button"
                                                disabled={isPaid}
                                                onClick={() => setSelectedInstallment(num)}
                                                className={`
                          py-3 rounded-xl font-bold transition-all
                          ${isPaid
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : isSelected
                                                            ? 'gradient-primary text-white shadow-lg shadow-primary-500/30'
                                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                    }
                        `}
                                            >
                                                {num}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    الأقساط المدفوعة: {paidInstallments.length > 0 ? paidInstallments.join(', ') : 'لا يوجد'}
                                </p>
                            </div>

                            {/* First Installment Notice */}
                            {selectedInstallment === 1 && !paidInstallments.includes(1) && (
                                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                                    <p className="text-green-700 font-medium">
                                        🎉 عند دفع القسط الأول سيتم تسليم الزي والكتب تلقائياً
                                    </p>
                                </div>
                            )}

                            {/* Amount */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">المبلغ (ج.س)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    min="1"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading || !selectedInstallment}
                                className="w-full py-3.5 rounded-xl gradient-primary text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        جاري التسجيل...
                                    </span>
                                ) : (
                                    'تأكيد الدفع'
                                )}
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}

export default PaymentModal;
