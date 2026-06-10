import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import TagList from '../../components/common/TagList.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { splitTags } from '../../utils/arrays.js';
import * as userService from '../../services/userService.js';

const ProfilePage = () => {
    const { user, setUser } = useAuth();
    const [form, setForm] = useState({
        name: user?.name ?? '',
        major: user?.major ?? '',
        description: user?.description ?? '',
        gpa: user?.gpa ?? 0,
        skills: user?.skills?.join(', ') ?? '',
        interests: user?.interests?.join(', ') ?? ''
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
            const profilePayload = {
                name: form.name,
                major: form.major,
                description: form.description
            };
            const [profile, gpaProfile, skillsProfile, interestsProfile] = await Promise.all([
                userService.updateProfile(profilePayload),
                userService.updateGpa(Number(form.gpa)),
                userService.updateSkills(splitTags(form.skills)),
                userService.updateInterests(splitTags(form.interests))
            ]);
            setUser({ ...profile, ...gpaProfile, ...skillsProfile, ...interestsProfile });
            toast.success('Đã cập nhật hồ sơ');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const skillsList = splitTags(form.skills);
    const interestsList = splitTags(form.interests);

    return (
        <div className='space-y-8 animate-in'>
            <section>
                <h1 className='text-2xl font-bold tracking-tight text-ink'>Hồ sơ</h1>
                <p className='mt-1.5 text-sm text-ink-secondary'>
                    Thông tin rõ ràng giúp AI gợi ý nhóm và đồng đội phù hợp hơn.
                </p>
            </section>

            <div className='grid gap-6 lg:grid-cols-[1fr_320px]'>
                <form className='card p-5' onSubmit={handleSubmit}>
                    <h2 className='text-sm font-semibold text-ink'>Thông tin cơ bản</h2>
                    <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                        <Input label='Họ và tên' name='name' value={form.name} onChange={handleChange} minLength={2} maxLength={50} required />
                        <Input label='Ngành học' name='major' value={form.major} onChange={handleChange} placeholder='Kỹ thuật phần mềm' />
                    </div>
                    <div className='mt-4 grid gap-4 sm:grid-cols-[140px_1fr]'>
                        <Input label='GPA' name='gpa' type='number' value={form.gpa} onChange={handleChange} min='0' max='4' step='0.01' />
                        <Input label='Kỹ năng' name='skills' value={form.skills} onChange={handleChange} placeholder='React, Node.js, MongoDB' />
                    </div>
                    <div className='mt-4'>
                        <Input label='Sở thích' name='interests' value={form.interests} onChange={handleChange} placeholder='AI, Web, Y tế số' />
                    </div>
                    <div className='mt-4'>
                        <Textarea label='Mô tả cá nhân' name='description' value={form.description} onChange={handleChange} maxLength={500} placeholder='Phong cách làm việc, mong muốn đồng đội, loại dự án muốn tham gia...' />
                    </div>
                    <div className='mt-5'>
                        <Button type='submit' disabled={isSaving}>
                            {isSaving ? 'Đang lưu...' : 'Lưu hồ sơ'}
                        </Button>
                    </div>
                </form>

                <aside className='space-y-4'>
                    <div className='card p-5'>
                        <h3 className='text-sm font-semibold text-ink'>Xem trước</h3>
                        <div className='mt-3 flex items-center gap-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white'>
                                {form.name.charAt(0) || 'S'}
                            </div>
                            <div>
                                <p className='text-sm font-medium text-ink'>{form.name || 'Tên sinh viên'}</p>
                                <p className='text-xs text-muted'>{form.major || 'Chưa cập nhật ngành học'}</p>
                            </div>
                        </div>
                        <div className='mt-4 grid grid-cols-2 gap-3'>
                            <div className='rounded-md bg-primary-light p-3'>
                                <p className='text-xs font-medium text-primary'>GPA</p>
                                <p className='mt-0.5 text-base font-semibold text-primary'>{Number(form.gpa || 0).toFixed(2)}</p>
                            </div>
                            <div className='rounded-md bg-surface p-3'>
                                <p className='text-xs font-medium text-muted'>Tín hiệu</p>
                                <p className='mt-0.5 text-base font-semibold text-ink'>{skillsList.length + interestsList.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className='card p-5'>
                        <h3 className='text-sm font-semibold text-ink'>Kỹ năng</h3>
                        <div className='mt-3'>
                            <TagList items={skillsList} />
                        </div>
                    </div>

                    <div className='card p-5'>
                        <h3 className='text-sm font-semibold text-ink'>Sở thích</h3>
                        <div className='mt-3'>
                            <TagList items={interestsList} tone='blue' />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ProfilePage;