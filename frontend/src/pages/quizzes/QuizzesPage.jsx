import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowRightIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import { getQuizzes, deleteQuiz } from '../../services/quizService.js';
import { useAuth } from '../../hooks/useAuth.js';

const difficultyConfig = {
    easy: { label: 'Dễ', className: 'bg-success-light text-success' },
    medium: { label: 'Trung bình', className: 'bg-[oklch(0.94_0.04_75)] text-[oklch(0.50_0.14_75)]' },
    hard: { label: 'Khó', className: 'bg-error-light text-error' }
};

const QuizzesPage = () => {
    const { user } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const isManager = user?.role === 'lecturer' || user?.role === 'admin';

    const loadData = async (query = '') => {
        setIsLoading(true);
        try {
            const response = await getQuizzes({ search: query, limit: 20, isPublished: true });
            setQuizzes(response.data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSearch = (e) => { e.preventDefault(); loadData(search); };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Xóa quiz "${title}"?`)) return;
        try {
            await deleteQuiz(id);
            toast.success('Đã xóa quiz');
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
                        <h1 className='mt-2 text-2xl font-bold tracking-tight text-ink'>Quiz ôn tập</h1>
                        <p className='mt-1.5 text-sm text-ink-secondary'>Làm quiz để ôn tập và kiểm tra kiến thức.</p>
                    </div>
                    {isManager && (
                        <Link to='/quizzes/create' className='inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-hover'>
                            Tạo quiz <ArrowRightIcon className='h-4 w-4' />
                        </Link>
                    )}
                </div>
                <form className='mt-5 flex gap-2' onSubmit={handleSearch}>
                    <div className='flex-1'><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Tìm quiz...' /></div>
                    <Button type='submit' disabled={isLoading}><MagnifyingGlassIcon className='h-4 w-4' />Tìm</Button>
                </form>
            </section>
            <section>
                {isLoading ? (
                    <div className='card p-8 text-center text-sm text-muted'>Đang tải quiz...</div>
                ) : quizzes.length > 0 ? (
                    <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                        {quizzes.map((quiz) => {
                            const config = difficultyConfig[quiz.difficulty] || difficultyConfig.medium;
                            return (
                                <article key={quiz._id} className='card animate-in p-5'>
                                    <div className='flex items-start justify-between gap-2'>
                                        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${config.className}`}>{config.label}</span>
                                        <span className='text-xs text-muted'>{quiz.questions?.length || 0} câu</span>
                                    </div>
                                    <h3 className='mt-3 text-base font-semibold text-ink'>{quiz.title}</h3>
                                    <p className='mt-1.5 text-sm leading-relaxed text-ink-secondary line-clamp-2'>{quiz.description || 'Không có mô tả'}</p>
                                    <div className='mt-3 flex items-center gap-2 text-xs text-muted'>
                                        <span>{quiz.durationMinutes} phút</span>
                                        <span>·</span>
                                        <span>{quiz.course?.name || 'Chung'}</span>
                                    </div>
                                    <div className='mt-4 flex gap-2 border-t border-border pt-3'>
                                        <Link to={`/quizzes/${quiz._id}/take`} className='inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-hover'>Làm quiz</Link>
                                        {isManager && (
                                            <>
                                                <Link to={`/quizzes/${quiz._id}/edit`} className='inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:bg-surface hover:text-ink'><PencilIcon className='h-3.5 w-3.5' />Sửa</Link>
                                                <button onClick={() => handleDelete(quiz._id, quiz.title)} className='inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error-light'><TrashIcon className='h-3.5 w-3.5' />Xóa</button>
                                            </>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className='card p-8 text-center text-sm text-muted'>Không tìm thấy quiz nào.</div>
                )}
            </section>
        </div>
    );
};

export default QuizzesPage;
