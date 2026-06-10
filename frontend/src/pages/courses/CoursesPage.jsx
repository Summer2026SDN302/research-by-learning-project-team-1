import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowRightIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import { getCourses, deleteCourse } from '../../services/courseService.js';
import { useAuth } from '../../hooks/useAuth.js';

const statusConfig = {
    active: { label: 'Đang mở', className: 'bg-primary-light text-primary' },
    archived: { label: 'Lưu trữ', className: 'bg-surface text-ink-secondary' },
    draft: { label: 'Bản nháp', className: 'bg-[oklch(0.94_0.04_75)] text-[oklch(0.50_0.14_75)]' }
};

const CoursesPage = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const isManager = user?.role === 'lecturer' || user?.role === 'admin';

    const loadData = async (query = '') => {
        setIsLoading(true);

        try {
            const response = await getCourses({ search: query, limit: 20 });
            setCourses(response.data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        loadData(search);
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Xóa môn học "${name}"?`)) return;

        try {
            await deleteCourse(id);
            toast.success('Đã xóa môn học');
            loadData(search);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className='space-y-8 animate-in'>
            <section>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
                    <div>
                        <p className='text-xs font-medium uppercase tracking-wider text-primary'>Học tập</p>
                        <h1 className='mt-2 text-2xl font-bold tracking-tight text-ink'>Môn học</h1>
                        <p className='mt-1.5 text-sm text-ink-secondary'>
                            Quản lý môn học, tài liệu và tài nguyên học tập.
                        </p>
                    </div>
                    {isManager && (
                        <Link
                            to='/courses/create'
                            className='inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-hover'
                        >
                            Thêm môn học
                            <ArrowRightIcon className='h-4 w-4' />
                        </Link>
                    )}
                </div>

                <form className='mt-5 flex gap-2' onSubmit={handleSearch}>
                    <div className='flex-1'>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder='Tìm theo tên, mã môn học...'
                        />
                    </div>
                    <Button type='submit' disabled={isLoading}>
                        <MagnifyingGlassIcon className='h-4 w-4' />
                        Tìm
                    </Button>
                </form>
            </section>

            <section>
                {isLoading ? (
                    <div className='card p-8 text-center text-sm text-muted'>Đang tải môn học...</div>
                ) : courses.length > 0 ? (
                    <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                        {courses.map((course) => {
                            const config = statusConfig[course.status] || statusConfig.active;

                            return (
                                <article key={course._id} className='card animate-in p-5'>
                                    <div className='flex items-start justify-between gap-2'>
                                        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${config.className}`}>
                                            {config.label}
                                        </span>
                                        <span className='font-mono text-xs text-muted'>{course.code}</span>
                                    </div>
                                    <h3 className='mt-3 text-base font-semibold text-ink'>{course.name}</h3>
                                    <p className='mt-1.5 text-sm leading-relaxed text-ink-secondary line-clamp-2'>
                                        {course.description || 'Chưa có mô tả'}
                                    </p>
                                    <div className='mt-3 flex items-center gap-2 text-xs text-muted'>
                                        <span>{course.lecturer?.name || 'Chưa phân công'}</span>
                                        {course.semester && <span>· {course.semester}</span>}
                                        <span>· {course.students?.length || 0} SV</span>
                                    </div>
                                    {isManager && (
                                        <div className='mt-4 flex gap-2 border-t border-border pt-3'>
                                            <Link
                                                to={`/courses/${course._id}/edit`}
                                                className='inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:bg-surface hover:text-ink'
                                            >
                                                <PencilIcon className='h-3.5 w-3.5' />
                                                Sửa
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(course._id, course.name)}
                                                className='inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error-light'
                                            >
                                                <TrashIcon className='h-3.5 w-3.5' />
                                                Xóa
                                            </button>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className='card p-8 text-center text-sm text-muted'>
                        Không tìm thấy môn học nào.
                    </div>
                )}
            </section>
        </div>
    );
};

export default CoursesPage;
