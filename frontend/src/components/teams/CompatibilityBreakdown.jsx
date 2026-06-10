const criteriaConfig = {
    gpa: { label: 'GPA', weight: 15, icon: '📊' },
    skills: { label: 'Kỹ năng', weight: 30, icon: '⚡' },
    interests: { label: 'Sở thích', weight: 25, icon: '🎯' },
    major: { label: 'Ngành học', weight: 15, icon: '🎓' },
    description: { label: 'Mô tả', weight: 15, icon: '📝' }
};

const getBarColor = (score) => {
    if (score >= 80) return { bar: 'bg-success', bg: 'bg-success-light' };
    if (score >= 60) return { bar: 'bg-primary', bg: 'bg-primary-light' };
    if (score >= 40) return { bar: 'bg-accent', bg: 'bg-accent-light' };
    return { bar: 'bg-muted', bg: 'bg-surface' };
};

const CompatibilityBreakdown = ({ breakdown = {} }) => {
    return (
        <div className='space-y-2.5'>
            {Object.entries(criteriaConfig).map(([key, { label, weight }]) => {
                const rawScore = breakdown[key] ?? 0;
                const displayScore = Math.round(rawScore);
                const weightedScore = Math.round(rawScore * weight / 100 * 10) / 10;
                const { bar, bg } = getBarColor(displayScore);

                return (
                    <div key={key}>
                        <div className='mb-1 flex items-center justify-between'>
                            <div className='flex items-center gap-1.5'>
                                <span className='text-xs'>{criteriaConfig[key].icon}</span>
                                <span className='text-xs font-medium text-ink-secondary'>{label}</span>
                                <span className='text-[10px] text-muted'>({weight}%)</span>
                            </div>
                            <div className='flex items-center gap-1.5'>
                                <span className='text-xs font-semibold text-ink'>{displayScore}%</span>
                                <span className='text-[10px] text-muted'>→ {weightedScore}đ</span>
                            </div>
                        </div>
                        <div className={`h-1.5 w-full overflow-hidden rounded-full ${bg}`}>
                            <div
                                className={`h-full rounded-full transition-all duration-700 ease-out ${bar}`}
                                style={{ width: `${displayScore}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CompatibilityBreakdown;
