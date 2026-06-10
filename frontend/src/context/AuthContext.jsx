import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as authService from '../services/authService';
import { AuthContext } from './authContext.js';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const persistSession = ({ user: nextUser, accessToken }) => {
        localStorage.setItem('ste_access_token', accessToken);
        setUser(nextUser);
    };

    const login = async (payload) => {
        const data = await authService.login(payload);
        persistSession(data);
        toast.success('Chào mừng bạn quay lại STE');
    };

    const register = async (payload) => {
        const data = await authService.register({ ...payload, role: 'student' });
        persistSession(data);
        toast.success('Hồ sơ sinh viên đã sẵn sàng');
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            localStorage.removeItem('ste_access_token');
            setUser(null);
            toast.success('Đã đăng xuất');
        }
    };

    const refreshProfile = async () => {
        const profile = await authService.getProfile();
        setUser(profile);
        return profile;
    };

    useEffect(() => {
        const bootstrap = async () => {
            const token = localStorage.getItem('ste_access_token');

            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                await refreshProfile();
            } catch {
                localStorage.removeItem('ste_access_token');
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        bootstrap();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated: Boolean(user), isLoading, login, register, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
