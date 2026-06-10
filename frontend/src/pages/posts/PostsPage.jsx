import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowRightIcon, HandThumbUpIcon, HeartIcon, BookmarkIcon, LightBulbIcon, MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import { getPosts, deletePost, toggleReaction } from '../../services/postService.js';
import { useAuth } from '../../hooks/useAuth.js';

const typeConfig = {
    announcement: { label: 'Thông báo', className: 'bg-primary-light text-primary' },
    academic_update: { label: 'Học thuật', className: 'bg-[oklch(0.93_0.03_230)] text-[oklch(0.42_0.12_230)]' },
    event_post: { label: 'Sự kiện', className: 'bg-[oklch(0.94_0.04_75)] text-[oklch(0.50_0.14_75)]' },
    club_announcement: { label: 'CLB', className: 'bg-success-light text-success' }
};

const reactionIcons = { like: HandThumbUpIcon, love: HeartIcon, useful: LightBulbIcon, bookmark: BookmarkIcon };

const PostsPage = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const isManager = ['lecturer', 'admin', 'club_leader'].includes(user?.role);

    const loadData = async (query = '', type = '') => {
        setIsLoading(true);
        try {
            const response = await getPosts({ search: query, type, limit: 20 });
            setPosts(response.data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSearch = (e) => { e.preventDefault(); loadData(search, typeFilter); };
    const handleTypeFilter = (type) => { setTypeFilter(type); loadData(search, type); };

    const handleReaction = async (postId, type) => {
        try {
            await toggleReaction(postId, type);
            loadData(search, typeFilter);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Xóa bài viết "${title}"?`)) return;
        try {
            await deletePost(id);
            toast.success('Đã xóa bài viết');
            loadData(search, typeFilter);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className='space-y-8 animate-in'>
            <section>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
                    <div>
                        <p className='text-xs font-medium uppercase tracking-wider text-primary'>Giao tiếp</p>
                        <h1 className='mt-2 text-2xl font-bold tracking-tight text-ink'>Thông báo & Bài viết</h1>
                        <p className='mt-1.5 text-sm text-ink-secondary'>Cập nhật thông báo, tin học thuật và sự kiện.</p>
                    </div>
                    {isManager && (
                        <Link to='/posts/create' className='inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-hover'>
                            Đăng bài <ArrowRightIcon className='h-4 w-4' />
                        </Link>
                    )}
                </div>
                <form className='mt-5 flex gap-2' onSubmit={handleSearch}>
                    <div className='flex-1'><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Tìm bài viết...' /></div>
                    <Button type='submit' disabled={isLoading}><MagnifyingGlassIcon className='h-4 w-4' />Tìm</Button>
                </form>
                <div className='mt-3 flex flex-wrap gap-2'>
                    <button onClick={() => handleTypeFilter('')} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${!typeFilter ? 'bg-primary text-white' : 'bg-surface text-ink-secondary hover:text-ink'}`}>Tất cả</button>
                    {Object.entries(typeConfig).map(([key, { label }]) => (
                        <button key={key} onClick={() => handleTypeFilter(key)} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${typeFilter === key ? 'bg-primary text-white' : 'bg-surface text-ink-secondary hover:text-ink'}`}>{label}</button>
                    ))}
                </div>
            </section>
            <section>
                {isLoading ? (
                    <div className='card p-8 text-center text-sm text-muted'>Đang tải...</div>
                ) : posts.length > 0 ? (
                    <div className='space-y-3'>
                        {posts.map((post) => {
                            const config = typeConfig[post.type] || typeConfig.announcement;
                            return (
                                <article key={post._id} className='card animate-in p-5'>
                                    <div className='flex items-start justify-between gap-2'>
                                        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${config.className}`}>{config.label}</span>
                                        <span className='text-xs text-muted'>{new Date(post.publishedAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <h3 className='mt-3 text-base font-semibold text-ink'>{post.title}</h3>
                                    <p className='mt-1.5 text-sm leading-relaxed text-ink-secondary'>{post.content}</p>
                                    <div className='mt-3 flex items-center gap-2 text-xs text-muted'>
                                        <span>{post.author?.name}</span>
                                        {post.course && <><span>·</span><span>{post.course.name}</span></>}
                                    </div>
                                    <div className='mt-4 flex items-center gap-3 border-t border-border pt-3'>
                                        {Object.entries(reactionIcons).map(([type, Icon]) => (
                                            <button key={type} onClick={() => handleReaction(post._id, type)} className='inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-ink-secondary transition-colors hover:bg-surface hover:text-ink'>
                                                <Icon className='h-3.5 w-3.5' />
                                                {post.reactions?.[type] || 0}
                                            </button>
                                        ))}
                                        {isManager && (
                                            <button onClick={() => handleDelete(post._id, post.title)} className='ml-auto inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error-light'>
                                                <TrashIcon className='h-3.5 w-3.5' />Xóa
                                            </button>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className='card p-8 text-center text-sm text-muted'>Không tìm thấy bài viết nào.</div>
                )}
            </section>
        </div>
    );
};

export default PostsPage;
