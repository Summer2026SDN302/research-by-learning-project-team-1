import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthShell from './AuthShell.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await register(form);
            navigate('/profile');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthShell
            eyebrow='Tạo tài khoản'
            title='Bắt đầu với STE'
            description='Tạo tài khoản, sau đó cập nhật GPA, kỹ năng và sở thích để AI gợi ý nhóm phù hợp.'
            linkText='Đã có tài khoản?'
            linkTo='/login'
            linkLabel='Đăng nhập'
        >
            <form className='space-y-4' onSubmit={handleSubmit}>
                <Input label='Họ và tên' name='name' value={form.name} onChange={handleChange} placeholder='Nguyễn Văn An' minLength={2} maxLength={50} required />
                <Input label='Email' name='email' type='email' value={form.email} onChange={handleChange} placeholder='student@fpt.edu.vn' required />
                <Input label='Mật khẩu' name='password' type='password' value={form.password} onChange={handleChange} placeholder='Tối thiểu 6 ký tự' minLength={6} required />
                <Button type='submit' className='w-full' disabled={isSubmitting}>
                    {isSubmitting ? 'Đang tạo...' : 'Tạo tài khoản'}
                </Button>
            </form>
        </AuthShell>
    );
};

export default RegisterPage;