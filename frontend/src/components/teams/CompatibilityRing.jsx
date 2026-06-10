const CompatibilityRing = ({ score = 0, size = 64, strokeWidth = 5 }) => {
    const displayScore = Math.round(Math.min(100, Math.max(0, score)));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (displayScore / 100) * circumference;

    const getColor = (s) => {
        if (s >= 80) return { stroke: 'oklch(0.55 0.17 145)', bg: 'oklch(0.95 0.03 145)', text: 'oklch(0.40 0.14 145)' };
        if (s >= 60) return { stroke: 'oklch(0.55 0.15 180)', bg: 'oklch(0.94 0.03 180)', text: 'oklch(0.42 0.12 180)' };
        if (s >= 40) return { stroke: 'oklch(0.65 0.18 30)', bg: 'oklch(0.95 0.04 30)', text: 'oklch(0.50 0.14 30)' };
        return { stroke: 'oklch(0.85 0.01 260)', bg: 'oklch(0.97 0.005 260)', text: 'oklch(0.60 0.01 260)' };
    };

    const color = getColor(displayScore);

    return (
        <div className='relative flex items-center justify-center' style={{ width: size, height: size }}>
            <svg width={size} height={size} className='-rotate-90'>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill='none'
                    stroke={color.bg}
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill='none'
                    stroke={color.stroke}
                    strokeWidth={strokeWidth}
                    strokeLinecap='round'
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className='transition-all duration-700 ease-out'
                />
            </svg>
            <div className='absolute flex flex-col items-center'>
                <span className='text-base font-bold' style={{ color: color.text }}>{displayScore}</span>
                <span className='text-[9px] font-medium text-muted'>/ 100</span>
            </div>
        </div>
    );
};

export default CompatibilityRing;
