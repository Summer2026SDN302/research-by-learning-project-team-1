import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowRightIcon, CalendarIcon, MapPinIcon, MagnifyingGlassIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import TagList from '../../components/common/TagList.jsx';
import { getEvents, deleteEvent, registerForEvent, cancelRegistration } from '../../services/eventService.js';
import { useAuth } from '../../hooks/useAuth.js';

const statusConfig = {
    draft: { label: 'Bản nháp', className: 'bg-surface text-ink-secondary' },
    published: { label: 'Đang mở', className: 'bg-primary-light text-primary' },
    cancelled: { label: 'Đã hủy', className: 'bg-error-light text-error' },
    completed: { label: 'Hoàn thành', className: 'bg-success-light text-success' }
};

const EventsPage = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const isManager = user?.role === 'admin' || user?.role === 'club_leader';

    const loadData = async (query = '') => {
        setIsLoading(true);
        try {
            const response = await getEvents({ search: query, limit: 20, status: 'published' });
            setEvents(response.data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSearch = (e) => { e.preventDefault(); loadData(search); };

    const handleRegister = async (eventId) => {
        try {
            await registerForEvent(eventId);
            toast.success('Đã đăng ký sự kiện');
            loadData(search);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleCancel = async (eventId) => {
        try {
            await cancelRegistration(eventId);
            toast.success('Đã hủy đăng ký');
            loadData(search);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Xóa sự kiện "${title}"?`)) return;
        try {
            await deleteEvent(id);
            toast.success('Đã xóa sự kiện');
            loadData(search);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <div className='space-y-8 animate-in'>
            <section>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
                    <div>
                        <p className='text-xs font-medium uppercase tracking-wider text-primary'>Sự kiện</p>
                        <h1 className='mt-2 text-2xl font-bold tracking-tight text-ink'>Sự kiện sắp tới</h1>
                        <p className='mt-1.5 text-sm text-ink-secondary'>Tham gia các sự kiện, hội thảo và hoạt động ngoại khóa.</p>
                    </div>
                    {isManager && (
                        <Link to='/events/create' className='inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-hover'>
                            Tạo sự kiện <ArrowRightIcon className='h-4 w-4' />
                        </Link>
                    )}
                </div>
                <form className='mt-5 flex gap-2' onSubmit={handleSearch}>
                    <div className='flex-1'><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Tìm sự kiện...' /></div>
                    <Button type='submit' disabled={isLoading}><MagnifyingGlassIcon className='h-4 w-4' />Tìm</Button>
                </form>
            </section>
            <section>
                {isLoading ? (
                    <div className='card p-8 text-center text-sm text-muted'>Đang tải...</div>
                ) : events.length > 0 ? (
                    <div className='grid gap-3 sm:grid-cols-2'>
                        {events.map((event) => {
                            const config = statusConfig[event.status] || statusConfig.published;
                            return (
                                <article key={event._id} className='card animate-in p-5'>
                                    <div className='flex items-start justify-between gap-2'>
                                        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${config.className}`}>{config.label}</span>
                                        <span className='flex items-center gap-1 text-xs text-muted'><UserGroupIcon className='h-3.5 w-3.5' />{event.participantCount || 0}/{event.capacity}</span>
                                    </div>
                                    <h3 className='mt-3 text-base font-semibold text-ink'>{event.title}</h3>
                                    <p className='mt-1.5 text-sm leading-relaxed text-ink-secondary line-clamp-2'>{event.description}</p>
                                    <div className='mt-3 space-y-1 text-xs text-muted'>
                                        <p className='flex items-center gap-1.5'><CalendarIcon className='h-3.5 w-3.5' />{formatDate(event.startAt)} - {formatDate(event.endAt)}</p>
                                        {event.location && <p className='flex items-center gap-1.5'><MapPinIcon className='h-3.5 w-3.5' />{event.location}</p>}
                                    </div>
                                    <div className='mt-3'><TagList items={event.tags} tone='blue' /></div>
                                    <div className='mt-4 flex gap-2 border-t border-border pt-3'>
                                        <Button size='sm' onClick={() => handleRegister(event._id)}>Đăng ký</Button>
                                        <Button size='sm' variant='secondary' onClick={() => handleCancel(event._id)}>Hủy</Button>
                                        {isManager && <button onClick={() => handleDelete(event._id, event.title)} className='ml-auto inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error-light'><TrashIcon className='h-3.5 w-3.5' />Xóa</button>}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className='card p-8 text-center text-sm text-muted'>Không tìm thấy sự kiện nào.</div>
                )}
            </section>
        </div>
    );
};

export default EventsPage;
