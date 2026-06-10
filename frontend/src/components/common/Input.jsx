const Input = ({ label, className = '', error, ...props }) => {
    return (
        <label className='block space-y-1.5'>
            {label && <span className='text-sm font-medium text-ink'>{label}</span>}
            <input
                className={`w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none transition-colors duration-150 placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary-light ${error ? 'border-error focus:border-error focus:ring-error-light' : ''} ${className}`}
                {...props}
            />
            {error && <span className='text-xs font-medium text-error'>{error}</span>}
        </label>
    );
};

export default Input;