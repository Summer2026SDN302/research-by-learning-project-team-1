import { useEffect, useRef, useState } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import {
    ArrowRightOnRectangleIcon,
    BookOpenIcon,
    CalendarDaysIcon,
    ChatBubbleLeftRightIcon,
    DocumentTextIcon,
    HomeIcon,
    QuestionMarkCircleIcon,
    ShieldCheckIcon,
    SparklesIcon,
    UserCircleIcon,
    UsersIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth.js';
import NotificationBell from '../notifications/NotificationBell.jsx';

const baseNavItems = [
    { to: '/', label: 'Trang chủ', icon: HomeIcon, end: true },
    { to: '/profile', label: 'Hồ sơ', icon: UserCircleIcon },
    { to: '/teams', label: 'Nhóm', icon: UsersIcon },
    { to: '/teammates', label: 'Đồng đội', icon: SparklesIcon },
    { to: '/courses', label: 'Môn học', icon: BookOpenIcon },
    { to: '/materials', label: 'Tài liệu', icon: DocumentTextIcon },
    { to: '/quizzes', label: 'Quiz', icon: QuestionMarkCircleIcon },
    { to: '/posts', label: 'Thông báo', icon: ChatBubbleLeftRightIcon },
    { to: '/events', label: 'Sự kiện', icon: CalendarDaysIcon },
];

const adminNavItem = { to: '/admin/users', label: 'Quản trị', icon: ShieldCheckIcon };

const mobileNavItems = [
    { to: '/', label: 'Trang chủ', icon: HomeIcon, end: true },
    { to: '/teams', label: 'Nhóm', icon: UsersIcon },
    { to: '/teammates', label: 'Đồng đội', icon: SparklesIcon },
    { to: '/quizzes', label: 'Quiz', icon: QuestionMarkCircleIcon },
    { to: '/events', label: 'Sự kiện', icon: CalendarDaysIcon },
];

const AppLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef(null);

    const navItems = user?.role === 'admin'
        ? [...baseNavItems, adminNavItem]
        : baseNavItems;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleProfileClick = () => {
        setMobileMenuOpen(false);
        navigate('/profile');
    };

    return (
        <div className='flex h-screen bg-white'>
            <aside className='hidden w-[260px] shrink-0 flex-col border-r border-border bg-white lg:flex'>
                <div className='flex items-center gap-2.5 border-b border-border px-5 py-4'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-white'>
                        S
                    </div>
                    <span className='text-sm font-semibold tracking-tight text-ink'>STE</span>
                </div>

                <nav className='flex-1 overflow-y-auto px-3 py-3'>
                    {navItems.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${isActive ? 'bg-primary-light text-primary' : 'text-ink-secondary hover:bg-surface hover:text-ink'}`
                            }
                        >
                            <Icon className='h-4 w-4' />
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <div className='flex min-w-0 flex-1 flex-col'>
                <header className='flex h-14 items-center justify-between border-b border-border bg-white px-4 lg:px-6'>
                    <div className='flex items-center gap-2.5 lg:hidden'>
                        <div className='flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-white'>
                            S
                        </div>
                        <span className='text-sm font-semibold tracking-tight text-ink'>STE</span>
                    </div>

                    <div className='ml-auto flex items-center gap-3'>
                        <NotificationBell />
                        <div ref={mobileMenuRef} className='relative'>
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className='flex h-9 w-9 items-center justify-center rounded-full bg-surface text-xs font-semibold text-ink transition-colors hover:bg-primary-light hover:text-primary'
                            >
                                {user?.name?.charAt(0) ?? 'S'}
                            </button>

                            {mobileMenuOpen && (
                                <div className='absolute right-0 top-full z-[60] mt-2 w-56 rounded-md border border-border bg-white p-1 shadow-lg'>
                                    <div className='border-b border-border px-3 py-2.5'>
                                        <p className='truncate text-sm font-medium text-ink'>{user?.name}</p>
                                        <p className='truncate text-xs text-muted'>{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={handleProfileClick}
                                        className='mt-1 flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium text-ink-secondary transition-colors duration-150 hover:bg-surface hover:text-ink'
                                    >
                                        <UserCircleIcon className='h-4 w-4' />
                                        Hồ sơ
                                    </button>
                                    <button
                                        onClick={logout}
                                        className='flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium text-ink-secondary transition-colors duration-150 hover:bg-surface hover:text-ink'
                                    >
                                        <ArrowRightOnRectangleIcon className='h-4 w-4' />
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className='min-w-0 flex-1 overflow-y-auto pb-16 lg:pb-0'>
                    <div className='px-4 py-6 sm:px-6 lg:px-10 lg:py-8'>
                        <Outlet />
                    </div>
                </main>
            </div>

            <nav className='fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-border bg-white/95 backdrop-blur-sm lg:hidden'>
                {mobileNavItems.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 px-4 py-2 text-[10px] font-medium transition-colors duration-150 ${isActive ? 'text-primary' : 'text-muted'}`
                        }
                    >
                        <Icon className='h-5 w-5' />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default AppLayout;