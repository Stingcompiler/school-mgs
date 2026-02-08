import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        api.onSessionExpired = () => {
            setSessionExpired(true);
        };
        checkAuth();
    }, []);

    useEffect(() => {
        if (sessionExpired) {
            const timer = setTimeout(() => {
                setSessionExpired(false);
                setUser(null);
                window.location.href = '/login';
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [sessionExpired]);

    const checkAuth = async () => {
        try {
            const userData = await api.getMe();
            setUser(userData);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const response = await api.login(username, password);
        setUser(response.user);
        return response;
    };

    const logout = async () => {
        await api.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
            {sessionExpired && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center transform animate-bounce-in">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">انتهت الجلسة</h3>
                        <p className="text-gray-500 mb-6">
                            انتهت صلاحية الجلسة. سيتم تحويلك إلى صفحة تسجيل الدخول خلال 5 ثوانٍ...
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                            <div className="bg-red-500 h-2 rounded-full animate-progress-shrink" style={{ width: '100%', animationDuration: '5s' }}></div>
                        </div>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
