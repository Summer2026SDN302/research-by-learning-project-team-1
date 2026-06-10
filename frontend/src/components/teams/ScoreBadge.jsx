const ScoreBadge = ({ score = 0, label = 'match' }) => {
    const displayScore = Math.round(Math.min(100, Math.max(0, score)));

    const getColor = (s) => {
        if (s >= 80) return 'bg-success text-white';
        if (s >= 60) return 'bg-primary text-white';
        if (s >= 40) return 'bg-accent text-white';
        return 'bg-surface text-ink-secondary';
    };

    return (
        <div className='flex items-center gap-3'>
            <div className={`flex h-11 w-11 items-center justify-center rounded-md text-base font-bold ${getColor(displayScore)}`}>
                {displayScore}
            </div>
            <div>
                <span className='block text-xs font-medium uppercase tracking-wider text-ink-secondary'>{label}</span>
                <span className='block text-[11px] text-muted'>độ phù hợp</span>
            </div>
        </div>
    );
};

export default ScoreBadge;