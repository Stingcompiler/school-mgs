import { useState, useEffect } from 'react';
import api from '../../api';
import { CreditCard, FileText, Download } from 'lucide-react';

function Finance() {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReceipts();
    }, []);

    const loadReceipts = async () => {
        try {
            const data = await api.getReceipts();
            setReceipts(data);
        } catch (error) {
            console.error('Failed to load receipts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">المالية</h1>
                <p className="text-gray-500">عرض الإيصالات والمدفوعات</p>
            </div>

            {/* Receipts Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-amber-600" />
                        الإيصالات
                    </h2>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                    </div>
                ) : receipts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500">لا توجد إيصالات بعد</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Card View */}
                        <div className="sm:hidden divide-y divide-gray-100">
                            {receipts.map((receipt) => (
                                <div key={receipt.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-bold text-gray-800 truncate">{receipt.student_name}</p>
                                                <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-medium shrink-0">
                                                    القسط {receipt.installment_number}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 font-mono mb-2">{receipt.student_code}</p>
                                            <div className="flex items-center gap-3 text-sm">
                                                <span className="text-primary-600 font-bold">{receipt.total_paid} ج.س</span>
                                                <span className="text-gray-400">|</span>
                                                <span className="text-gray-500">{new Date(receipt.created_at).toLocaleDateString('ar-SD')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop/Tablet Table View */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="hidden lg:table-cell px-4 py-4 text-right text-sm font-medium text-gray-500">رقم الإيصال</th>
                                        <th className="px-4 py-4 text-right text-sm font-medium text-gray-500">الطالب</th>
                                        <th className="px-4 py-4 text-right text-sm font-medium text-gray-500">القسط</th>
                                        <th className="px-4 py-4 text-right text-sm font-medium text-gray-500">المدفوع</th>
                                        <th className="hidden lg:table-cell px-4 py-4 text-right text-sm font-medium text-gray-500">المتبقي</th>
                                        <th className="px-4 py-4 text-right text-sm font-medium text-gray-500">التاريخ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {receipts.map((receipt) => (
                                        <tr key={receipt.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="hidden lg:table-cell px-4 py-4">
                                                <span className="font-mono text-sm text-gray-600">
                                                    {receipt.receipt_number.slice(0, 8)}...
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="font-medium text-gray-800">{receipt.student_name}</p>
                                                <p className="text-sm text-gray-500 font-mono">{receipt.student_code}</p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                                                    القسط {receipt.installment_number}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="font-bold text-primary-600">{receipt.total_paid} ج.س</p>
                                            </td>
                                            <td className="hidden lg:table-cell px-4 py-4">
                                                <p className="font-medium text-gray-600">{receipt.remaining_amount} ج.س</p>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-500">
                                                {new Date(receipt.created_at).toLocaleDateString('ar-SD')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Finance;
