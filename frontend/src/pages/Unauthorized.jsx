import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';

function Unauthorized() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';
    const [count, setCount] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCount((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/login', { state: { from: location.state?.from } });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate, location, from]);

    const handleLoginRedirect = () => {
        navigate('/login', { state: { from: location.state?.from } });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-fadeIn">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10 text-amber-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">تنبيه أمني</h1>
                <p className="text-gray-600 mb-6">
                    عذراً، لا يمكنك الوصول إلى هذه الصفحة دون تسجيل الدخول.
                    سيتم تحويلك إلى صفحة تسجيل الدخول خلال {count} ثوانٍ.
                </p>

                <button
                    onClick={handleLoginRedirect}
                    className="w-full py-3 rounded-xl gradient-primary text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                    الذهاب لتسجيل الدخول
                    <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                </button>
            </div>
        </div>
    );
}

export default Unauthorized;
