import { useEffect, useRef, useState } from 'react';
import { BellIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../../services/notificationService.js';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const panelRef = useRef(null);

    const loadNotifications = async () => {
        try {
            const response = await getNotifications({ limit: 10 });
            setNotifications(response.data);
            setUnreadCount(response.pagination?.total || 0);
        } catch {
            // silent
        }
    };

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkRead = async (id) => {
        try {
            await markAsRead(id);
            loadNotifications();
        } catch {
            // silent
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead();
            loadNotifications();
        } catch {
            // silent
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
            loadNotifications();
        } catch {
            // silent
        }
    };

    return (
        <div ref={panelRef} className='relative'>
            <button onClick={() => setIsOpen(!isOpen)} className='relative flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-surface'>
                <BellIcon className='h-5 w-5 text-ink-secondary' />
                {unreadCount > 0 && (
                    <span className='absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white'>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className='absolute right-0 top-full z-50 mt-2 w-80 rounded-md border border-border bg-white shadow-lg'>
                    <div className='flex items-center justify-between border-b border-border px-4 py-3'>
                        <h3 className='text-sm font-semibold text-ink'>Thông báo</h3>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllRead} className='text-xs font-medium text-primary hover:underline'>
                                Đánh dấu tất cả
                            </button>
                        )}
                    </div>
                    <div className='max-h-80 overflow-y-auto'>
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <div key={notif._id} className={`flex items-start gap-3 border-b border-border px-4 py-3 last:border-0 ${!notif.isRead ? 'bg-primary-light/30' : ''}`}>
                                    <div className='min-w-0 flex-1'>
                                        <p className='text-sm font-medium text-ink'>{notif.title}</p>
                                        <p className='mt-0.5 text-xs text-ink-secondary'>{notif.message}</p>
                                        <p className='mt-1 text-[10px] text-muted'>{new Date(notif.createdAt).toLocaleString('vi-VN')}</p>
                                    </div>
                                    <div className='flex shrink-0 gap-1'>
                                        {!notif.isRead && (
                                            <button onClick={() => handleMarkRead(notif._id)} className='rounded p-1 text-muted hover:text-success'>
                                                <CheckIcon className='h-3.5 w-3.5' />
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(notif._id)} className='rounded p-1 text-muted hover:text-error'>
                                            <TrashIcon className='h-3.5 w-3.5' />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className='px-4 py-8 text-center text-sm text-muted'>Không có thông báo</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
