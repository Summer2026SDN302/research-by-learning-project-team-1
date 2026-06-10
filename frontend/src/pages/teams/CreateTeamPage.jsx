import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import { createTeam } from '../../services/teamService.js';
import { splitTags } from '../../utils/arrays.js';

const CreateTeamPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        description: '',
        maxMembers: 5,
        requiredSkills: '',
        tags: '',
        course: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await createTeam({
                name: form.name,
                description: form.description,
                maxMembers: Number(form.maxMembers),
                requiredSkills: splitTags(form.requiredSkills),
                tags: splitTags(form.tags),
                course: form.course
            });
            toast.success('Đã tạo nhóm');
            navigate('/teams');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='animate-in'>
            <section>
                <h1 className='text-2xl font-bold tracking-tight text-ink'>Tạo nhóm mới</h1>
                <p className='mt-1.5 text-sm text-ink-secondary'>
                    Mô tả rõ ràng giúp AI định tuyến đúng thành viên: vai trò, kỹ năng và mục tiêu.
                </p>
            </section>

            <form className='mt-6' onSubmit={handleSubmit}>
                <div className='card p-5'>
                    <h2 className='text-sm font-semibold text-ink'>Thông tin nhóm</h2>
                    <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                        <Input label='Tên nhóm' name='name' value={form.name} onChange={handleChange} minLength={3} maxLength={100} required />
                        <Input label='Môn học' name='course' value={form.course} onChange={handleChange} placeholder='SDN302' />
                    </div>
                    <div className='mt-4'>
                        <Textarea label='Mô tả nhóm' name='description' value={form.description} onChange={handleChange} maxLength={1000} required placeholder='Nhóm đang xây gì? Cần người như thế nào? Deadline ra sao?' />
                    </div>
                    <div className='mt-4 grid gap-4 sm:grid-cols-3'>
                        <Input label='Số thành viên tối đa' name='maxMembers' type='number' value={form.maxMembers} onChange={handleChange} min='2' max='10' />
                        <Input label='Kỹ năng cần có' name='requiredSkills' value={form.requiredSkills} onChange={handleChange} placeholder='Backend, UI/UX, Data' />
                        <Input label='Chủ đề' name='tags' value={form.tags} onChange={handleChange} placeholder='AI, Y tế, Hackathon' />
                    </div>
                    <div className='mt-5'>
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? 'Đang tạo...' : 'Tạo nhóm'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateTeamPage;