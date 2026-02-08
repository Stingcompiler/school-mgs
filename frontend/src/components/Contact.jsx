import { useState } from 'react';
import { Send, User, Mail, Phone, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus(null);

        try {
            await api.submitContactMessage(formData);
            setStatus({
                type: 'success',
                message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.'
            });
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.message || 'حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact-form" className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 font-medium mb-4">
                        أرسل رسالة
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                        نسعد بتواصلكم معنا
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        لديك استفسار أو ملاحظة؟ أرسل لنا رسالتك وسنرد عليك في أقرب وقت ممكن.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-3xl shadow-xl p-8 animate-fadeIn">
                    {/* Status Message */}
                    {status && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-fadeIn ${status.type === 'success'
                                ? 'bg-green-50 border border-green-100 text-green-700'
                                : 'bg-red-50 border border-red-100 text-red-600'
                            }`}>
                            {status.type === 'success'
                                ? <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                : <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            }
                            <span>{status.message}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name & Email Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    الاسم الكامل *
                                </label>
                                <div className="relative">
                                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                        placeholder="أدخل اسمك الكامل"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    البريد الإلكتروني *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                        placeholder="example@email.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Phone & Subject Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    رقم الهاتف (اختياري)
                                </label>
                                <div className="relative">
                                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                        placeholder="0912345678"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    الموضوع *
                                </label>
                                <div className="relative">
                                    <MessageSquare className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                        placeholder="موضوع الرسالة"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                الرسالة *
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                                placeholder="اكتب رسالتك هنا..."
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 rounded-xl gradient-primary text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    جاري الإرسال...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    إرسال الرسالة
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Contact;
