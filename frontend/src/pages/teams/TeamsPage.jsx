import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import TeamCard from '../../components/teams/TeamCard.jsx';
import { getRecommendedTeams, getTeams } from '../../services/teamService.js';

const TeamsPage = () => {
    const [teams, setTeams] = useState([]);
    const [recommendedTeams, setRecommendedTeams] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async (query = '') => {
        setIsLoading(true);

        try {
            const [teamsResponse, recommendationsResponse] = await Promise.all([
                getTeams({ search: query, status: 'open', limit: 12 }),
                getRecommendedTeams({ limit: 6 })
            ]);
            setTeams(teamsResponse.data);
            setRecommendedTeams(recommendationsResponse.data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            loadData();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        loadData(search);
    };

    return (
        <div className='space-y-8 animate-in'>
            <section>
                <p className='text-xs font-medium uppercase tracking-wider text-primary'>Không gian nhóm</p>
                <div className='mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold tracking-tight text-ink'>
                            Những nhóm đang chờ đúng người.
                        </h1>
                        <p className='mt-1.5 text-sm text-ink-secondary'>
                            Duyệt nhóm đang mở, xem điểm phù hợp và gửi lời giới thiệu.
                        </p>
                    </div>
                    <Link
                        to='/teams/create'
                        className='inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-hover'
                    >
                        Tạo nhóm mới
                        <ArrowRightIcon className='h-4 w-4' />
                    </Link>
                </div>

                <form className='mt-5 flex gap-2' onSubmit={handleSearch}>
                    <div className='flex-1'>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder='Tìm theo tên nhóm, kỹ năng, môn học...'
                        />
                    </div>
                    <Button type='submit' disabled={isLoading}>
                        <MagnifyingGlassIcon className='h-4 w-4' />
                        Tìm
                    </Button>
                </form>
            </section>

            <section>
                <div className='flex items-center justify-between'>
                    <h2 className='text-sm font-semibold text-ink'>Gợi ý cho bạn</h2>
                    <span className='rounded-md bg-primary-light px-2 py-0.5 text-xs font-medium text-primary'>
                        {recommendedTeams.length} nhóm
                    </span>
                </div>
                <div className='mt-3 space-y-3'>
                    {isLoading ? (
                        <div className='card p-8 text-center text-sm text-muted'>
                            Đang tải gợi ý...
                        </div>
                    ) : recommendedTeams.length > 0 ? (
                        recommendedTeams.map((team) => <TeamCard key={team._id} team={team} showScore />)
                    ) : (
                        <div className='card p-8 text-center text-sm text-muted'>
                            Chưa có gợi ý phù hợp. Hãy cập nhật hồ sơ để nhận gợi ý tốt hơn.
                        </div>
                    )}
                </div>
            </section>

            <section>
                <div className='flex items-center justify-between'>
                    <h2 className='text-sm font-semibold text-ink'>Nhóm đang mở</h2>
                    <span className='rounded-md bg-surface px-2 py-0.5 text-xs font-medium text-ink-secondary'>
                        {teams.length} nhóm
                    </span>
                </div>
                <div className='mt-3 grid gap-3 lg:grid-cols-2'>
                    {teams.length > 0 ? (
                        teams.map((team) => <TeamCard key={team._id} team={team} />)
                    ) : (
                        <div className='card p-8 text-center text-sm text-muted lg:col-span-2'>
                            Không tìm thấy nhóm phù hợp.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default TeamsPage;