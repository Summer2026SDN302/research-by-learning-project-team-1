const toneMap = {
    green: 'bg-primary-light text-primary',
    blue: 'bg-[oklch(0.93_0.03_230)] text-[oklch(0.42_0.12_230)]',
    amber: 'bg-[oklch(0.94_0.04_75)] text-[oklch(0.50_0.14_75)]',
    neutral: 'bg-surface text-ink-secondary'
};

const TagList = ({ items = [], tone = 'green' }) => {
    if (!items.length) {
        return <span className='text-sm text-muted'>Chưa cập nhật</span>;
    }

    return (
        <div className='flex flex-wrap gap-1.5'>
            {items.map((item) => (
                <span key={item} className={`rounded-md px-2 py-0.5 text-xs font-medium ${toneMap[tone] || toneMap.green}`}>
                    {item}
                </span>
            ))}
        </div>
    );
};

export default TagList;