import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { Users, Shirt, CreditCard, Mail, MailOpen } from 'lucide-react';

function DashboardHome() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await api.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'إجمالي الطلاب',
            value: stats?.total_students || 0,
            icon: Users,
            color: 'from-primary-500 to-primary-600',
            bgColor: 'bg-primary-50',
        },
        {
            title: 'الزي المسلم',
            value: stats?.total_uniforms_delivered || 0,
            icon: Shirt,
            color: 'from-accent-500 to-accent-600',
            bgColor: 'bg-accent-50',
        },
        {
            title: 'إجمالي المدفوعات',
            value: stats?.total_payments || 0,
            icon: CreditCard,
            color: 'from-amber-500 to-orange-500',
            bgColor: 'bg-amber-50',
        },
        {
            title: 'رسائل غير مقروءة',
            value: stats?.unread_messages || 0,
            icon: Mail,
            color: 'from-rose-500 to-pink-600',
            bgColor: 'bg-rose-50',
            link: '/dashboard/messages',
        },
    ];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ar-SD', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
                <p className="text-gray-500">مرحباً بك في نظام إدارة  أكاديمية ستينج الخاصة بنين - بنات    </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => {
                    const CardWrapper = card.link ? Link : 'div';
                    return (
                        <CardWrapper
                            key={index}
                            to={card.link}
                            className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow ${card.link ? 'cursor-pointer' : ''}`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-500 font-medium mb-1">{card.title}</p>
                                    <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center`}>
                                    <card.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardWrapper>
                    );
                })}
            </div>

            {/* Students by Level & Recent Payments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h2 className="font-bold text-gray-800 mb-4">الطلاب حسب الصف</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((level) => (
                            <div key={level} className="flex items-center gap-4">
                                <div className="w-20 text-gray-600 font-medium">الصف {level}</div>
                                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full gradient-primary rounded-full transition-all duration-500"
                                        style={{
                                            width: `${((stats?.students_by_level?.[`level_${level}`] || 0) / Math.max(stats?.total_students || 1, 1)) * 100}%`
                                        }}
                                    />
                                </div>
                                <div className="w-12 text-left font-bold text-gray-800">
                                    {stats?.students_by_level?.[`level_${level}`] || 0}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Payments */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h2 className="font-bold text-gray-800 mb-4">آخر المدفوعات</h2>
                    {stats?.recent_payments?.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recent_payments.map((payment, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800">{payment.student?.name || 'طالب'}</p>
                                        <p className="text-sm text-gray-500">القسط {payment.installment_number}</p>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-primary-600">{payment.amount} ج.س</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            لا توجد مدفوعات حتى الآن
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-800">آخر الرسائل</h2>
                    <Link
                        to="/dashboard/messages"
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                        عرض الكل ←
                    </Link>
                </div>
                {stats?.recent_messages?.length > 0 ? (
                    <div className="space-y-3">
                        {stats.recent_messages.map((message) => (
                            <Link
                                key={message.id}
                                to="/dashboard/messages"
                                className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${message.is_read ? 'bg-gray-50 hover:bg-gray-100' : 'bg-primary-50 hover:bg-primary-100'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${message.is_read
                                        ? 'bg-gray-200 text-gray-500'
                                        : 'gradient-primary text-white'
                                    }`}>
                                    {message.is_read ? (
                                        <MailOpen className="w-5 h-5" />
                                    ) : (
                                        <Mail className="w-5 h-5" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className={`font-medium truncate ${!message.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                                            {message.name}
                                        </p>
                                        {!message.is_read && (
                                            <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{message.subject}</p>
                                </div>
                                <span className="text-xs text-gray-400 flex-shrink-0">
                                    {formatDate(message.created_at)}
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        لا توجد رسائل حتى الآن
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardHome;

