import { useState, useEffect } from 'react';
import { Mail, MailOpen, Trash2, Phone, Calendar, User, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../api';

function Messages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [filter, setFilter] = useState('all'); // all, unread, read
    const [toast, setToast] = useState(null);

    useEffect(() => {
        loadMessages();
    }, [filter]);

    const loadMessages = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filter === 'unread') params.is_read = 'false';
            if (filter === 'read') params.is_read = 'true';

            const data = await api.getContactMessages(params);
            setMessages(data.results || data);
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = async (id) => {
        if (expandedId === id) {
            setExpandedId(null);
        } else {
            setExpandedId(id);
            // Mark as read when expanded
            const message = messages.find(m => m.id === id);
            if (message && !message.is_read) {
                await markAsRead(id);
            }
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.updateContactMessage(id, { is_read: true });
            setMessages(prev => prev.map(m =>
                m.id === id ? { ...m, is_read: true } : m
            ));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const deleteMessage = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;

        try {
            await api.deleteContactMessage(id);
            setMessages(prev => prev.filter(m => m.id !== id));
            setToast({ type: 'success', message: 'تم حذف الرسالة بنجاح' });
            if (expandedId === id) setExpandedId(null);
        } catch (error) {
            setToast({ type: 'error', message: 'فشل حذف الرسالة' });
        }
        setTimeout(() => setToast(null), 3000);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ar-SD', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const unreadCount = messages.filter(m => !m.is_read).length;

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Toast */}
            {toast && (
                <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">الرسائل</h1>
                    <p className="text-gray-500">
                        رسائل التواصل من الزوار
                        {unreadCount > 0 && (
                            <span className="mr-2 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-sm font-medium">
                                {unreadCount} جديدة
                            </span>
                        )}
                    </p>
                </div>

                {/* Filter */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                ? 'bg-primary-100 text-primary-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        الكل
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'unread'
                                ? 'bg-primary-100 text-primary-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        غير مقروءة
                    </button>
                    <button
                        onClick={() => setFilter('read')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'read'
                                ? 'bg-primary-100 text-primary-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        مقروءة
                    </button>
                </div>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500">لا توجد رسائل</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {messages.map((message) => (
                            <div key={message.id} className="group">
                                {/* Message Header */}
                                <div
                                    onClick={() => toggleExpand(message.id)}
                                    className={`p-4 flex items-center gap-4 cursor-pointer transition-colors hover:bg-gray-50 ${!message.is_read ? 'bg-primary-50/50' : ''
                                        }`}
                                >
                                    {/* Icon */}
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${message.is_read
                                            ? 'bg-gray-100 text-gray-500'
                                            : 'gradient-primary text-white'
                                        }`}>
                                        {message.is_read ? (
                                            <MailOpen className="w-5 h-5" />
                                        ) : (
                                            <Mail className="w-5 h-5" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className={`font-bold ${!message.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                                                {message.name}
                                            </p>
                                            {!message.is_read && (
                                                <span className="w-2 h-2 rounded-full bg-primary-500" />
                                            )}
                                        </div>
                                        <p className="text-gray-600 truncate">{message.subject}</p>
                                    </div>

                                    {/* Date & Actions */}
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-400 hidden sm:block">
                                            {formatDate(message.created_at)}
                                        </span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteMessage(message.id); }}
                                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        {expandedId === message.id ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {expandedId === message.id && (
                                    <div className="px-4 pb-4 bg-gray-50 animate-fadeIn">
                                        <div className="bg-white rounded-xl p-6 border border-gray-100">
                                            {/* Contact Info */}
                                            <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-gray-100">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <span>{message.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    <a href={`mailto:${message.email}`} className="text-primary-600 hover:underline">
                                                        {message.email}
                                                    </a>
                                                </div>
                                                {message.phone && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Phone className="w-4 h-4 text-gray-400" />
                                                        <a href={`tel:${message.phone}`} className="text-primary-600 hover:underline">
                                                            {message.phone}
                                                        </a>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span>{formatDate(message.created_at)}</span>
                                                </div>
                                            </div>

                                            {/* Subject */}
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                                    <MessageSquare className="w-4 h-4" />
                                                    <span>الموضوع</span>
                                                </div>
                                                <p className="font-bold text-gray-800">{message.subject}</p>
                                            </div>

                                            {/* Message Body */}
                                            <div>
                                                <p className="text-gray-600 text-sm mb-2">الرسالة</p>
                                                <div className="p-4 bg-gray-50 rounded-xl text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                    {message.message}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                                                <a
                                                    href={`mailto:${message.email}?subject=رد: ${message.subject}`}
                                                    className="flex-1 py-2.5 rounded-xl gradient-primary text-white font-medium text-center hover:opacity-90 transition-opacity"
                                                >
                                                    رد عبر البريد
                                                </a>
                                                {message.phone && (
                                                    <a
                                                        href={`https://wa.me/${message.phone.replace(/\D/g, '').replace(/^0/, '249')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-6 py-2.5 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
                                                    >
                                                        واتساب
                                                    </a>
                                                )}
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

export default Messages;
