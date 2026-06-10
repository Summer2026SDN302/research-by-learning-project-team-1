import { Link } from 'react-router-dom';
import { ArrowRightIcon, SparklesIcon, UserGroupIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import TagList from '../components/common/TagList.jsx';
import { useAuth } from '../hooks/useAuth.js';

const DashboardPage = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'GPA', value: user?.gpa?.toFixed?.(2) ?? '0.00', icon: WrenchScrewdriverIcon },
        { label: 'Kỹ năng', value: `${user?.skills?.length ?? 0} kỹ năng`, icon: SparklesIcon },
        { label: 'Nhóm', value: 'Sẵn sàng', icon: UserGroupIcon }
    ];

    return (
        <div className='space-y-8'>
            <section className='animate-in'>
                <p className='text-xs font-medium uppercase tracking-wider text-primary'>Trang chủ</p>
                <h1 className='mt-2 text-3xl font-bold tracking-tight text-ink'>
                    Xin chào, {user?.name?.split(' ').pop() || 'bạn'}
                </h1>
                <p className='mt-2 text-sm text-ink-secondary'>
                    Hoàn thiện hồ sơ để nhận gợi ý nhóm phù hợp hơn.
                </p>
                <div className='mt-5 flex flex-wrap gap-3'>
                    <Link
                        to='/teams'
                        className='inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-hover'
                    >
                        Tìm nhóm
                        <ArrowRightIcon className='h-4 w-4' />
                    </Link>
                    <Link
                        to='/profile'
                        className='inline-flex items-center rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-ink transition-colors duration-150 hover:bg-surface'
                    >
                        Cập nhật hồ sơ
                    </Link>
                </div>
            </section>

            <section className='grid gap-4 sm:grid-cols-3'>
                {stats.map(({ label, value, icon: Icon }, i) => (
                    <div
                        key={label}
                        className={`card animate-in stagger-${i + 1} p-5`}
                    >
                        <div className='flex h-9 w-9 items-center justify-center rounded-md bg-primary-light text-primary'>
                            <Icon className='h-4 w-4' />
                        </div>
                        <p className='mt-3 text-xs font-medium text-muted'>{label}</p>
                        <p className='mt-1 text-lg font-semibold text-ink'>{value}</p>
                    </div>
                ))}
            </section>

            <section className='card animate-in stagger-3 p-5'>
                <h2 className='text-sm font-semibold text-ink'>Hồ sơ của bạn</h2>
                <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                    <div>
                        <p className='text-xs font-medium text-muted'>Ngành học</p>
                        <p className='mt-1 text-sm text-ink'>{user?.major || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                        <p className='text-xs font-medium text-muted'>Mô tả</p>
                        <p className='mt-1 text-sm text-ink-secondary'>{user?.description || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                        <p className='text-xs font-medium text-muted'>Kỹ năng</p>
                        <div className='mt-1.5'>
                            <TagList items={user?.skills ?? []} />
                        </div>
                    </div>
                    <div>
                        <p className='text-xs font-medium text-muted'>Sở thích</p>
                        <div className='mt-1.5'>
                            <TagList items={user?.interests ?? []} tone='blue' />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DashboardPage;