import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import { getUsers, getUserById, updateUser, deleteUser } from '../../services/adminService.js';
import { splitTags } from '../../utils/arrays.js';

const roleConfig = {
    student: { label: 'Sinh viên', className: 'bg-[oklch(0.93_0.03_230)] text-[oklch(0.42_0.12_230)]' },
    lecturer: { label: 'Giảng viên', className: 'bg-primary-light text-primary' },
    admin: { label: 'Quản trị', className: 'bg-error-light text-error' },
    club_leader: { label: 'Chủ CLB', className: 'bg-[oklch(0.94_0.04_75)] text-[oklch(0.50_0.14_75)]' }
};

const ROLES = ['student', 'lecturer', 'admin', 'club_leader'];

const EditUserModal = ({ user, onClose, onSave }) => {
    const [form, setForm] = useState({
        name: user?.name ?? '',
        email: user?.email ?? '',
        role: user?.role ?? 'student',
        major: user?.major ?? '',
        gpa: user?.gpa ?? 0,
        skills: user?.skills?.join(', ') ?? '',
        interests: user?.interests?.join(', ') ?? '',
        description: user?.description ?? ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await onSave(user._id, {
                name: form.name,
                email: form.email,
                role: form.role,
                major: form.major,
                gpa: Number(form.gpa),
                skills: splitTags(form.skills),
                interests: splitTags(form.interests),
                description: form.description
            });
        } finally {
            setIsSaving(false);
        }
    };

    return createPortal(
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4' onClick={onClose}>
            <div className='w-full max-w-lg animate-in rounded-lg border border-border bg-white shadow-xl' onClick={(e) => e.stopPropagation()}>
                <div className='flex items-center justify-between border-b border-border px-5 py-4'>
                    <h2 className='text-base font-semibold text-ink'>Chỉnh sửa người dùng</h2>
                    <button onClick={onClose} className='rounded-md p-1 text-muted transition-colors hover:bg-surface hover:text-ink'>
                        <XMarkIcon className='h-5 w-5' />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='max-h-[70vh] overflow-y-auto px-5 py-4'>
                    <div className='grid gap-4 sm:grid-cols-2'>
                        <Input label='Họ và tên' name='name' value={form.name} onChange={handleChange} required />
                        <Input label='Email' name='email' type='email' value={form.email} onChange={handleChange} required />
                    </div>
                    <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                        <label className='block space-y-1.5'>
                            <span className='text-sm font-medium text-ink'>Vai trò</span>
                            <select name='role' value={form.role} onChange={handleChange} className='w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary-light'>
                                {ROLES.map((r) => <option key={r} value={r}>{roleConfig[r]?.label || r}</option>)}
                            </select>
                        </label>
                        <Input label='Ngành học' name='major' value={form.major} onChange={handleChange} />
                    </div>
                    <div className='mt-4 grid gap-4 sm:grid-cols-[140px_1fr]'>
                        <Input label='GPA' name='gpa' type='number' value={form.gpa} onChange={handleChange} min='0' max='4' step='0.01' />
                        <Input label='Kỹ năng' name='skills' value={form.skills} onChange={handleChange} placeholder='React, Node.js, ...' />
                    </div>
                    <div className='mt-4'>
                        <Input label='Sở thích' name='interests' value={form.interests} onChange={handleChange} placeholder='AI, Web, ...' />
                    </div>
                    <div className='mt-4'>
                        <Textarea label='Mô tả' name='description' value={form.description} onChange={handleChange} maxLength={500} />
                    </div>

                    <div className='mt-5 flex justify-end gap-3'>
                        <Button variant='secondary' onClick={onClose}>Hủy</Button>
                        <Button type='submit' disabled={isSaving}>{isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}</Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);

    const loadData = async (query = '', role = '') => {
        setIsLoading(true);

        try {
            const response = await getUsers({ search: query, role, limit: 30 });
            setUsers(response.data);
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
        loadData(search, roleFilter);
    };

    const handleRoleFilter = (role) => {
        setRoleFilter(role);
        loadData(search, role);
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Xóa người dùng "${name}"?`)) return;

        try {
            await deleteUser(id);
            toast.success('Đã xóa người dùng');
            loadData(search, roleFilter);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleOpenEdit = async (userId) => {
        try {
            const user = await getUserById(userId);
            setEditingUser(user);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleSaveEdit = async (userId, data) => {
        try {
            await updateUser(userId, data);
            toast.success('Đã cập nhật thông tin');
            setEditingUser(null);
            loadData(search, roleFilter);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className='space-y-8 animate-in'>
            <section>
                <p className='text-xs font-medium uppercase tracking-wider text-primary'>Quản trị</p>
                <h1 className='mt-2 text-2xl font-bold tracking-tight text-ink'>Quản lý người dùng</h1>
                <p className='mt-1.5 text-sm text-ink-secondary'>
                    Xem, chỉnh sửa thông tin hoặc xóa người dùng trong hệ thống.
                </p>
            </section>

            <section>
                <form className='flex gap-2' onSubmit={handleSearch}>
                    <div className='flex-1'>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder='Tìm theo tên, email...'
                        />
                    </div>
                    <Button type='submit' disabled={isLoading}>
                        <MagnifyingGlassIcon className='h-4 w-4' />
                        Tìm
                    </Button>
                </form>

                <div className='mt-3 flex flex-wrap gap-2'>
                    <button
                        onClick={() => handleRoleFilter('')}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${!roleFilter ? 'bg-primary text-white' : 'bg-surface text-ink-secondary hover:text-ink'}`}
                    >
                        Tất cả
                    </button>
                    {ROLES.map((role) => (
                        <button
                            key={role}
                            onClick={() => handleRoleFilter(role)}
                            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${roleFilter === role ? 'bg-primary text-white' : 'bg-surface text-ink-secondary hover:text-ink'}`}
                        >
                            {roleConfig[role]?.label || role}
                        </button>
                    ))}
                </div>
            </section>

            <section>
                {isLoading ? (
                    <div className='card p-8 text-center text-sm text-muted'>Đang tải...</div>
                ) : users.length > 0 ? (
                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm'>
                            <thead>
                                <tr className='border-b border-border text-left text-xs font-medium text-muted'>
                                    <th className='px-4 py-3'>Người dùng</th>
                                    <th className='px-4 py-3'>Email</th>
                                    <th className='px-4 py-3'>Vai trò</th>
                                    <th className='px-4 py-3'>Ngành</th>
                                    <th className='px-4 py-3'>GPA</th>
                                    <th className='px-4 py-3 text-right'>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => {
                                    const config = roleConfig[u.role] || roleConfig.student;

                                    return (
                                        <tr key={u._id} className='border-b border-border last:border-0'>
                                            <td className='px-4 py-3'>
                                                <div className='flex items-center gap-2.5'>
                                                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white'>
                                                        {u.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <span className='font-medium text-ink'>{u.name}</span>
                                                </div>
                                            </td>
                                            <td className='px-4 py-3 text-ink-secondary'>{u.email}</td>
                                            <td className='px-4 py-3'>
                                                <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${config.className}`}>
                                                    {config.label}
                                                </span>
                                            </td>
                                            <td className='px-4 py-3 text-ink-secondary'>{u.major || '-'}</td>
                                            <td className='px-4 py-3 text-ink-secondary'>
                                                {u.role === 'student' ? (u.gpa?.toFixed(2) ?? '-') : '-'}
                                            </td>
                                            <td className='px-4 py-3'>
                                                <div className='flex justify-end gap-1'>
                                                    <button
                                                        onClick={() => handleOpenEdit(u._id)}
                                                        className='inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:bg-surface hover:text-ink'
                                                    >
                                                        <PencilIcon className='h-3.5 w-3.5' />
                                                        Sửa
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(u._id, u.name)}
                                                        className='inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error-light'
                                                    >
                                                        <TrashIcon className='h-3.5 w-3.5' />
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className='card p-8 text-center text-sm text-muted'>
                        Không tìm thấy người dùng nào.
                    </div>
                )}
            </section>

            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
};

export default AdminUsersPage;
