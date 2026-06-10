import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthShell from './AuthShell.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await login(form);
            navigate('/');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthShell
            eyebrow='Đăng nhập'
            title='Chào mừng bạn quay lại'
            description='Đăng nhập để cập nhật hồ sơ và tìm nhóm phù hợp.'
            linkText='Chưa có tài khoản?'
            linkTo='/register'
            linkLabel='Tạo tài khoản mới'
        >
            <form className='space-y-4' onSubmit={handleSubmit}>
                <Input label='Email' name='email' type='email' value={form.email} onChange={handleChange} placeholder='student@fpt.edu.vn' required />
                <Input label='Mật khẩu' name='password' type='password' value={form.password} placeholder='Nhập mật khẩu' onChange={handleChange} required />
                <Button type='submit' className='w-full' disabled={isSubmitting}>
                    {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
            </form>
        </AuthShell>
    );
};

export default LoginPage;