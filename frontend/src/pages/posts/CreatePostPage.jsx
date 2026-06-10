import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import { createPost } from '../../services/postService.js';

const POST_TYPES = [
    { value: 'announcement', label: 'Thông báo' },
    { value: 'academic_update', label: 'Cập nhật học thuật' },
    { value: 'event_post', label: 'Bài viết sự kiện' },
    { value: 'club_announcement', label: 'Thông báo CLB' }
];

const CreatePostPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: '', content: '', type: 'announcement' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => { const { name, value } = e.target; setForm((prev) => ({ ...prev, [name]: value })); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createPost(form);
            toast.success('Đã đăng bài');
            navigate('/posts');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='animate-in'>
            <section>
                <h1 className='text-2xl font-bold tracking-tight text-ink'>Đăng bài viết mới</h1>
                <p className='mt-1.5 text-sm text-ink-secondary'>Chia sẻ thông báo, tin học thuật hoặc sự kiện.</p>
            </section>
            <form className='mt-6' onSubmit={handleSubmit}>
                <div className='card p-5'>
                    <div className='grid gap-4 sm:grid-cols-2'>
                        <Input label='Tiêu đề' name='title' value={form.title} onChange={handleChange} required />
                        <label className='block space-y-1.5'>
                            <span className='text-sm font-medium text-ink'>Loại bài viết</span>
                            <select name='type' value={form.type} onChange={handleChange} className='w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-primary'>
                                {POST_TYPES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                            </select>
                        </label>
                    </div>
                    <div className='mt-4'>
                        <Textarea label='Nội dung' name='content' value={form.content} onChange={handleChange} maxLength={5000} required />
                    </div>
                    <div className='mt-5 flex gap-3'>
                        <Button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Đang đăng...' : 'Đăng bài'}</Button>
                        <Button variant='secondary' onClick={() => navigate('/posts')}>Hủy</Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreatePostPage;
