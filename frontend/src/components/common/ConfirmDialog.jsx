import { AlertTriangle, X } from 'lucide-react';

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, isDestructive = false }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-primary-100 text-primary-600'}`}>
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <h2 className="font-bold text-gray-800 text-lg">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 flex gap-3">
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-white transition-opacity hover:opacity-90 shadow-lg ${isDestructive ? 'bg-red-600 shadow-red-500/30' : 'bg-primary-600 shadow-primary-500/30'}`}
                    >
                        تأكيد
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-gray-300 font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;
