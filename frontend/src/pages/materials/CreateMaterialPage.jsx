import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import { createMaterial } from '../../services/materialService.js';
import { getCourses } from '../../services/courseService.js';
import { splitTags } from '../../utils/arrays.js';

const CreateMaterialPage = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({
        title: '',
        description: '',
        course: '',
        fileUrl: '',
        fileName: '',
        fileType: '',
        fileSize: 0,
        tags: '',
        visibility: 'course',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const response = await getCourses({ limit: 50 });
                setCourses(response.data);
            } catch {
                toast.error('Không thể tải danh sách môn học');
            }
        };

        loadCourses();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await createMaterial({
                ...form,
                tags: splitTags(form.tags),
                fileSize: Number(form.fileSize) || 0,
            });
            toast.success('Đã tải lên tài liệu');
            navigate('/materials');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='animate-in'>
            <section>
                <h1 className='text-2xl font-bold tracking-tight text-ink'>Tải lên tài liệu</h1>
                <p className='mt-1.5 text-sm text-ink-secondary'>
                    Chia sẻ tài liệu học tập đã xác minh cho sinh viên.
                </p>
            </section>

            <form className='mt-6' onSubmit={handleSubmit}>
                <div className='card p-5'>
                    <h2 className='text-sm font-semibold text-ink'>Thông tin tài liệu</h2>
                    <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                        <Input
                            label='Tiêu đề'
                            name='title'
                            value={form.title}
                            onChange={handleChange}
                            placeholder='Giáo trình nhập môn...'
                            minLength={3}
                            maxLength={180}
                            required
                        />
                        <select
                            name='course'
                            value={form.course}
                            onChange={handleChange}
                            className='w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none transition-colors duration-150 focus:border-primary focus:ring-2 focus:ring-primary-light'
                            required
                        >
                            <option value=''>Chọn môn học</option>
                            {courses.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.code} - {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='mt-4'>
                        <Textarea
                            label='Mô tả'
                            name='description'
                            value={form.description}
                            onChange={handleChange}
                            maxLength={1000}
                            placeholder='Mô tả nội dung tài liệu...'
                        />
                    </div>
                    <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                        <Input
                            label='Đường dẫn tệp'
                            name='fileUrl'
                            value={form.fileUrl}
                            onChange={handleChange}
                            placeholder='https://...'
                            required
                        />
                        <Input
                            label='Tên tệp'
                            name='fileName'
                            value={form.fileName}
                            onChange={handleChange}
                            placeholder='giao-trinh.pdf'
                            required
                        />
                    </div>
                    <div className='mt-4 grid gap-4 sm:grid-cols-3'>
                        <Input
                            label='Loại tệp'
                            name='fileType'
                            value={form.fileType}
                            onChange={handleChange}
                            placeholder='pdf'
                        />
                        <Input
                            label='Kích thước (bytes)'
                            name='fileSize'
                            type='number'
                            value={form.fileSize}
                            onChange={handleChange}
                            min='0'
                        />
                        <select
                            name='visibility'
                            value={form.visibility}
                            onChange={handleChange}
                            className='w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none transition-colors duration-150 focus:border-primary focus:ring-2 focus:ring-primary-light'
                        >
                            <option value='course'>Môn học</option>
                            <option value='public'>Công khai</option>
                            <option value='private'>Riêng tư</option>
                        </select>
                    </div>
                    <div className='mt-4'>
                        <Input
                            label='Thẻ (phân cách bởi dấu phẩy)'
                            name='tags'
                            value={form.tags}
                            onChange={handleChange}
                            placeholder='chương 1, nhập môn, cơ bản'
                        />
                    </div>
                    <div className='mt-5 flex gap-3'>
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? 'Đang tải lên...' : 'Tải lên'}
                        </Button>
                        <Button variant='secondary' onClick={() => navigate('/materials')}>
                            Hủy
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateMaterialPage;
