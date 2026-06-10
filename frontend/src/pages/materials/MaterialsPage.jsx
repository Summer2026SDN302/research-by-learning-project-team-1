import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowRightIcon, ArrowDownTrayIcon, MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import TagList from '../../components/common/TagList.jsx';
import { getMaterials, deleteMaterial, downloadMaterial } from '../../services/materialService.js';
import { useAuth } from '../../hooks/useAuth.js';

const visibilityConfig = {
    public: { label: 'Công khai', className: 'bg-primary-light text-primary' },
    course: { label: 'Môn học', className: 'bg-[oklch(0.93_0.03_230)] text-[oklch(0.42_0.12_230)]' },
    private: { label: 'Riêng tư', className: 'bg-surface text-ink-secondary' }
};

const MaterialsPage = () => {
    const { user } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const isManager = user?.role === 'lecturer' || user?.role === 'admin';

    const loadData = async (query = '') => {
        setIsLoading(true);

        try {
            const response = await getMaterials({ search: query, limit: 20 });
            setMaterials(response.data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        loadData(search);
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Xóa tài liệu "${title}"?`)) return;

        try {
            await deleteMaterial(id);
            toast.success('Đã xóa tài liệu');
            loadData(search);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDownload = async (id) => {
        try {
            const material = await downloadMaterial(id);
            if (material.fileUrl) {
                window.open(material.fileUrl, '_blank');
            }
            toast.success('Đang tải xuống...');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className='space-y-8 animate-in'>
            <section>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
                    <div>
                        <p className='text-xs font-medium uppercase tracking-wider text-primary'>Tài nguyên</p>
                        <h1 className='mt-2 text-2xl font-bold tracking-tight text-ink'>Tài liệu học tập</h1>
                        <p className='mt-1.5 text-sm text-ink-secondary'>
                            Tài liệu được xác minh từ giảng viên và nhà trường.
                        </p>
                    </div>
                    {isManager && (
                        <Link
                            to='/materials/create'
                            className='inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-hover'
                        >
                            Tải lên tài liệu
                            <ArrowRightIcon className='h-4 w-4' />
                        </Link>
                    )}
                </div>

                <form className='mt-5 flex gap-2' onSubmit={handleSearch}>
                    <div className='flex-1'>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder='Tìm tài liệu...'
                        />
                    </div>
                    <Button type='submit' disabled={isLoading}>
                        <MagnifyingGlassIcon className='h-4 w-4' />
                        Tìm
                    </Button>
                </form>
            </section>

            <section>
                {isLoading ? (
                    <div className='card p-8 text-center text-sm text-muted'>Đang tải tài liệu...</div>
                ) : materials.length > 0 ? (
                    <div className='grid gap-3 sm:grid-cols-2'>
                        {materials.map((material) => {
                            const config = visibilityConfig[material.visibility] || visibilityConfig.course;

                            return (
                                <article key={material._id} className='card animate-in p-5'>
                                    <div className='flex items-start justify-between gap-2'>
                                        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${config.className}`}>
                                            {config.label}
                                        </span>
                                        {material.verified && (
                                            <span className='rounded-md bg-success-light px-2 py-0.5 text-xs font-medium text-success'>
                                                Đã xác minh
                                            </span>
                                        )}
                                    </div>
                                    <h3 className='mt-3 text-base font-semibold text-ink'>{material.title}</h3>
                                    <p className='mt-1.5 text-sm leading-relaxed text-ink-secondary line-clamp-2'>
                                        {material.description || 'Không có mô tả'}
                                    </p>
                                    <div className='mt-3'>
                                        <TagList items={material.tags} tone='blue' />
                                    </div>
                                    <div className='mt-3 flex items-center gap-3 text-xs text-muted'>
                                        <span>{material.course?.name || 'Chưa phân môn'}</span>
                                        <span>·</span>
                                        <span>{material.uploadedBy?.name}</span>
                                        {material.fileSize > 0 && (
                                            <>
                                                <span>·</span>
                                                <span>{formatFileSize(material.fileSize)}</span>
                                            </>
                                        )}
                                        <span>·</span>
                                        <span>{material.downloadCount} lượt tải</span>
                                    </div>
                                    <div className='mt-4 flex gap-2 border-t border-border pt-3'>
                                        <Button size='sm' variant='secondary' onClick={() => handleDownload(material._id)}>
                                            <ArrowDownTrayIcon className='h-3.5 w-3.5' />
                                            Tải xuống
                                        </Button>
                                        {isManager && (
                                            <button
                                                onClick={() => handleDelete(material._id, material.title)}
                                                className='inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error-light'
                                            >
                                                <TrashIcon className='h-3.5 w-3.5' />
                                                Xóa
                                            </button>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className='card p-8 text-center text-sm text-muted'>
                        Không tìm thấy tài liệu nào.
                    </div>
                )}
            </section>
        </div>
    );
};

export default MaterialsPage;
