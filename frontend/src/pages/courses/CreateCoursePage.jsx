import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import { createCourse } from '../../services/courseService.js';

const CreateCoursePage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        code: '',
        name: '',
        description: '',
        semester: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await createCourse(form);
            toast.success('Đã tạo môn học');
            navigate('/courses');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='animate-in'>
            <section>
                <h1 className='text-2xl font-bold tracking-tight text-ink'>Thêm môn học mới</h1>
                <p className='mt-1.5 text-sm text-ink-secondary'>
                    Tạo môn học để quản lý tài liệu và sinh viên theo từng khóa.
                </p>
            </section>

            <form className='mt-6' onSubmit={handleSubmit}>
                <div className='card p-5'>
                    <h2 className='text-sm font-semibold text-ink'>Thông tin môn học</h2>
                    <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                        <Input
                            label='Mã môn học'
                            name='code'
                            value={form.code}
                            onChange={handleChange}
                            placeholder='SDN302'
                            minLength={2}
                            maxLength={20}
                            required
                        />
                        <Input
                            label='Học kỳ'
                            name='semester'
                            value={form.semester}
                            onChange={handleChange}
                            placeholder='HK1 2025-2026'
                        />
                    </div>
                    <div className='mt-4'>
                        <Input
                            label='Tên môn học'
                            name='name'
                            value={form.name}
                            onChange={handleChange}
                            placeholder='Nhập tên môn học'
                            minLength={2}
                            maxLength={150}
                            required
                        />
                    </div>
                    <div className='mt-4'>
                        <Textarea
                            label='Mô tả'
                            name='description'
                            value={form.description}
                            onChange={handleChange}
                            maxLength={1000}
                            placeholder='Mô tả nội dung, mục tiêu môn học...'
                        />
                    </div>
                    <div className='mt-5 flex gap-3'>
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? 'Đang tạo...' : 'Tạo môn học'}
                        </Button>
                        <Button variant='secondary' onClick={() => navigate('/courses')}>
                            Hủy
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateCoursePage;
