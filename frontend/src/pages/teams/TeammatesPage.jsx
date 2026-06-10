import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FunnelIcon } from '@heroicons/react/24/outline';
import CompatibilityRing from '../../components/teams/CompatibilityRing.jsx';
import CompatibilityBreakdown from '../../components/teams/CompatibilityBreakdown.jsx';
import { getRecommendedTeammates } from '../../services/teamService.js';
import { useAuth } from '../../hooks/useAuth.js';

const getScoreLabel = (score) => {
    if (score >= 80) return { text: 'Rất phù hợp', className: 'text-success' };
    if (score >= 60) return { text: 'Khá phù hợp', className: 'text-primary' };
    if (score >= 40) return { text: 'Trung bình', className: 'text-accent' };
    return { text: 'Ít phù hợp', className: 'text-muted' };
};

const getSharedItems = (userItems = [], targetItems = []) => {
    const userSet = new Set(userItems.map((i) => i.toLowerCase()));
    return targetItems.filter((i) => userSet.has(i.toLowerCase()));
};

const SharedTags = ({ shared = [], label }) => {
    if (!shared.length) return null;

    return (
        <div className='rounded-md border border-primary-light bg-primary-light/30 p-2.5'>
            <p className='mb-1.5 text-[10px] font-medium uppercase tracking-wider text-primary'>{label} chung ({shared.length})</p>
            <div className='flex flex-wrap gap-1'>
                {shared.map((item) => (
                    <span key={item} className='rounded-md bg-primary px-1.5 py-0.5 text-[11px] font-medium text-white'>
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
};

const SORT_OPTIONS = [
    { value: 'total', label: 'Điểm phù hợp' },
    { value: 'skills', label: 'Kỹ năng' },
    { value: 'interests', label: 'Sở thích' },
    { value: 'gpa', label: 'GPA' },
];

const TeammatesPage = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState('total');
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            try {
                const response = await getRecommendedTeammates({ limit: 30 });
                setStudents(response.data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const sortedStudents = useMemo(() => {
        if (sortBy === 'total') return students;

        return [...students].sort((a, b) => {
            const scoreA = a.compatibilityScore?.breakdown?.[sortBy] ?? 0;
            const scoreB = b.compatibilityScore?.breakdown?.[sortBy] ?? 0;
            return scoreB - scoreA;
        });
    }, [students, sortBy]);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className='space-y-8 animate-in'>
            <section>
                <p className='text-xs font-medium uppercase tracking-wider text-primary'>AI đồng đội</p>
                <h1 className='mt-2 text-2xl font-bold tracking-tight text-ink'>
                    Tìm đồng đội phù hợp
                </h1>
                <p className='mt-1.5 text-sm text-ink-secondary'>
                    AI phân tích GPA, kỹ năng, sở thích, ngành học và mô tả để gợi ý đồng đội phù hợp nhất.
                </p>
            </section>

            <section className='flex items-center gap-3'>
                <FunnelIcon className='h-4 w-4 text-muted' />
                <span className='text-xs font-medium text-muted'>Sắp xếp:</span>
                <div className='flex gap-1.5'>
                    {SORT_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setSortBy(value)}
                            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${sortBy === value ? 'bg-primary text-white' : 'bg-surface text-ink-secondary hover:text-ink'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </section>

            {isLoading ? (
                <div className='card p-8 text-center text-sm text-muted'>
                    Đang tải gợi ý đồng đội...
                </div>
            ) : sortedStudents.length > 0 ? (
                <div className='space-y-3'>
                    {sortedStudents.map((student, i) => {
                        const totalScore = Math.round(student.compatibilityScore?.total ?? 0);
                        const breakdown = student.compatibilityScore?.breakdown ?? {};
                        const scoreLabel = getScoreLabel(totalScore);
                        const sharedSkills = getSharedItems(user?.skills ?? [], student.skills ?? []);
                        const sharedInterests = getSharedItems(user?.interests ?? [], student.interests ?? []);
                        const isExpanded = expandedId === student._id;

                        return (
                            <article
                                key={student._id}
                                className={`card animate-in stagger-${Math.min(i + 1, 5)} overflow-hidden transition-all duration-200 ${isExpanded ? 'ring-2 ring-primary-light' : ''}`}
                            >
                                <div className='p-5'>
                                    <div className='flex items-start gap-4'>
                                        <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white'>
                                            {student.name?.charAt(0) ?? 'S'}
                                        </div>

                                        <div className='min-w-0 flex-1'>
                                            <div className='flex items-start justify-between gap-3'>
                                                <div>
                                                    <h3 className='text-base font-semibold text-ink'>{student.name}</h3>
                                                    <p className='mt-0.5 text-sm text-ink-secondary'>
                                                        {student.major || 'Chưa cập nhật ngành'} · GPA {student.gpa?.toFixed?.(2) ?? '0.00'}
                                                    </p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <CompatibilityRing score={totalScore} size={56} strokeWidth={4} />
                                                </div>
                                            </div>

                                            <div className='mt-2 flex items-center gap-2'>
                                                <span className={`text-xs font-medium ${scoreLabel.className}`}>
                                                    {scoreLabel.text}
                                                </span>
                                                <span className='text-xs text-muted'>·</span>
                                                <span className='text-xs text-muted'>
                                                    {sharedSkills.length + sharedInterests.length} điểm chung
                                                </span>
                                            </div>

                                            {student.description && (
                                                <p className='mt-2 text-sm leading-relaxed text-ink-secondary line-clamp-2'>
                                                    {student.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                                        <div className='rounded-md bg-surface p-3'>
                                            <p className='mb-1.5 text-xs font-medium text-muted'>Kỹ năng</p>
                                            <div className='flex flex-wrap gap-1'>
                                                {(student.skills ?? []).map((skill) => {
                                                    const isShared = sharedSkills.some((s) => s.toLowerCase() === skill.toLowerCase());
                                                    return (
                                                        <span
                                                            key={skill}
                                                            className={`rounded-md px-2 py-0.5 text-xs font-medium ${isShared ? 'bg-primary text-white' : 'bg-primary-light text-primary'}`}
                                                        >
                                                            {skill}
                                                        </span>
                                                    );
                                                })}
                                                {!student.skills?.length && <span className='text-xs text-muted'>Chưa cập nhật</span>}
                                            </div>
                                        </div>
                                        <div className='rounded-md bg-surface p-3'>
                                            <p className='mb-1.5 text-xs font-medium text-muted'>Sở thích</p>
                                            <div className='flex flex-wrap gap-1'>
                                                {(student.interests ?? []).map((interest) => {
                                                    const isShared = sharedInterests.some((i) => i.toLowerCase() === interest.toLowerCase());
                                                    return (
                                                        <span
                                                            key={interest}
                                                            className={`rounded-md px-2 py-0.5 text-xs font-medium ${isShared ? 'bg-[oklch(0.42_0.12_230)] text-white' : 'bg-[oklch(0.93_0.03_230)] text-[oklch(0.42_0.12_230)]'}`}
                                                        >
                                                            {interest}
                                                        </span>
                                                    );
                                                })}
                                                {!student.interests?.length && <span className='text-xs text-muted'>Chưa cập nhật</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleExpand(student._id)}
                                        className='mt-3 text-xs font-medium text-primary hover:text-primary-hover'
                                    >
                                        {isExpanded ? 'Thu gọn' : 'Xem chi tiết độ phù hợp'}
                                    </button>
                                </div>

                                {isExpanded && (
                                    <div className='border-t border-border bg-surface/50 p-5'>
                                        <div className='grid gap-5 lg:grid-cols-[1fr_280px]'>
                                            <div>
                                                <h4 className='mb-3 text-sm font-semibold text-ink'>Phân tích chi tiết</h4>
                                                <CompatibilityBreakdown breakdown={breakdown} />
                                            </div>

                                            <div className='space-y-3'>
                                                <SharedTags shared={sharedSkills} label='Kỹ năng' />
                                                <SharedTags shared={sharedInterests} label='Sở thích' />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            ) : (
                <div className='card p-8 text-center text-sm text-muted'>
                    Chưa có gợi ý đồng đội. Hãy cập nhật hồ sơ để nhận gợi ý tốt hơn.
                </div>
            )}
        </div>
    );
};

export default TeammatesPage;
