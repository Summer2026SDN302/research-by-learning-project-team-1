import { Link } from 'react-router-dom';

const steps = [
    { title: 'Hoàn thiện hồ sơ', text: 'Cập nhật GPA, kỹ năng, sở thích và mô tả cá nhân.' },
    { title: 'Nhận gợi ý AI', text: 'Nhóm và đồng đội được xếp hạng theo độ phù hợp.' },
    { title: 'Bắt đầu làm nhóm', text: 'Gửi yêu cầu tham gia và cộng tác hiệu quả hơn.' }
];

const AuthShell = ({ children, eyebrow, title, description, linkText, linkTo, linkLabel }) => {
    return (
        <main className='flex min-h-screen bg-white'>
            <section className='hidden w-[440px] shrink-0 flex-col justify-between border-r border-border bg-surface p-10 lg:flex'>
                <div>
                    <div className='flex items-center gap-2.5'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-white'>
                            S
                        </div>
                        <span className='text-sm font-semibold tracking-tight text-ink'>STE</span>
                    </div>

                    <h2 className='mt-14 text-3xl font-bold leading-tight tracking-tight text-ink'>
                        Một không gian cho việc học nhóm.
                    </h2>
                    <p className='mt-4 max-w-[320px] text-sm leading-relaxed text-ink-secondary'>
                        Thiết kế để sinh viên dễ tìm nhóm, cập nhật hồ sơ và kết nối đồng đội.
                    </p>
                </div>

                <div className='space-y-5'>
                    {steps.map((step, index) => (
                        <div key={step.title} className='flex items-start gap-3'>
                            <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-white'>
                                {index + 1}
                            </span>
                            <div>
                                <p className='text-sm font-medium text-ink'>{step.title}</p>
                                <p className='mt-0.5 text-xs text-ink-secondary'>{step.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className='flex flex-1 flex-col items-center justify-center px-6 py-8'>
                <div className='w-full max-w-[380px]'>
                    <p className='text-xs font-medium uppercase tracking-wider text-primary'>{eyebrow}</p>
                    <h1 className='mt-2 text-2xl font-bold tracking-tight text-ink'>{title}</h1>
                    <p className='mt-2 text-sm text-ink-secondary'>{description}</p>
                    <div className='mt-6'>{children}</div>
                    <p className='mt-6 text-center text-sm text-ink-secondary'>
                        {linkText}{' '}
                        <Link to={linkTo} className='font-medium text-primary hover:text-primary-hover'>
                            {linkLabel}
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default AuthShell;