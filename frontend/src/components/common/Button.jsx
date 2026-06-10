const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    secondary: 'bg-white text-ink border border-border hover:bg-surface',
    ghost: 'text-ink-secondary hover:text-ink hover:bg-surface',
    danger: 'bg-error text-white hover:opacity-90'
};

const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm'
};

const Button = ({ children, className = '', variant = 'primary', size = 'md', type = 'button', ...props }) => {
    return (
        <button
            type={type}
            className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;