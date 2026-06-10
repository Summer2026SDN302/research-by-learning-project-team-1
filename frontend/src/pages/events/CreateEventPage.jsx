import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import { createEvent } from '../../services/eventService.js';
import { splitTags } from '../../utils/arrays.js';

const CreateEventPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: '', description: '', location: '', onlineLink: '', startAt: '', endAt: '', capacity: 100, tags: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => { const { name, value } = e.target; setForm((prev) => ({ ...prev, [name]: value })); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createEvent({ ...form, capacity: Number(form.capacity), tags: splitTags(form.tags) });
            toast.success('Đã tạo sự kiện');
            navigate('/events');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='animate-in'>
            <section>
                <h1 className='text-2xl font-bold tracking-tight text-ink'>Tạo sự kiện mới</h1>
                <p className='mt-1.5 text-sm text-ink-secondary'>Tạo sự kiện để sinh viên đăng ký tham gia.</p>
            </section>
            <form className='mt-6' onSubmit={handleSubmit}>
                <div className='card p-5'>
                    <div className='grid gap-4 sm:grid-cols-2'>
                        <Input label='Tiêu đề' name='title' value={form.title} onChange={handleChange} required />
                        <Input label='Sức chứa' name='capacity' type='number' value={form.capacity} onChange={handleChange} min='1' />
                    </div>
                    <div className='mt-4'><Textarea label='Mô tả' name='description' value={form.description} onChange={handleChange} required /></div>
                    <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                        <Input label='Địa điểm' name='location' value={form.location} onChange={handleChange} />
                        <Input label='Link online' name='onlineLink' value={form.onlineLink} onChange={handleChange} />
                    </div>
                    <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                        <Input label='Bắt đầu' name='startAt' type='datetime-local' value={form.startAt} onChange={handleChange} required />
                        <Input label='Kết thúc' name='endAt' type='datetime-local' value={form.endAt} onChange={handleChange} required />
                    </div>
                    <div className='mt-4'><Input label='Thẻ (phân cách bởi dấu phẩy)' name='tags' value={form.tags} onChange={handleChange} placeholder='hackathon, AI, workshop' /></div>
                    <div className='mt-5 flex gap-3'>
                        <Button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Đang tạo...' : 'Tạo sự kiện'}</Button>
                        <Button variant='secondary' onClick={() => navigate('/events')}>Hủy</Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateEventPage;
