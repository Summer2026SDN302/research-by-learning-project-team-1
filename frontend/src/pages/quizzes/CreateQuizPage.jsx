import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import { createQuiz } from '../../services/quizService.js';

const CreateQuizPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: '', description: '', difficulty: 'medium', durationMinutes: 15 });
    const [questions, setQuestions] = useState([{ question: '', options: ['', ''], correctAnswer: '', explanation: '' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => { const { name, value } = e.target; setForm((prev) => ({ ...prev, [name]: value })); };

    const updateQuestion = (index, field, value) => {
        setQuestions((prev) => prev.map((q, i) => i === index ? { ...q, [field]: value } : q));
    };

    const updateOption = (qIndex, oIndex, value) => {
        setQuestions((prev) => prev.map((q, i) => {
            if (i !== qIndex) return q;
            const opts = [...q.options];
            opts[oIndex] = value;
            return { ...q, options: opts };
        }));
    };

    const addQuestion = () => setQuestions((prev) => [...prev, { question: '', options: ['', ''], correctAnswer: '', explanation: '' }]);
    const removeQuestion = (index) => setQuestions((prev) => prev.filter((_, i) => i !== index));
    const addOption = (qIndex) => setQuestions((prev) => prev.map((q, i) => i === qIndex ? { ...q, options: [...q.options, ''] } : q));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createQuiz({ ...form, durationMinutes: Number(form.durationMinutes), questions });
            toast.success('Đã tạo quiz');
            navigate('/quizzes');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='animate-in'>
            <section>
                <h1 className='text-2xl font-bold tracking-tight text-ink'>Tạo quiz mới</h1>
                <p className='mt-1.5 text-sm text-ink-secondary'>Tạo bài quiz để sinh viên ôn tập.</p>
            </section>
            <form className='mt-6 space-y-4' onSubmit={handleSubmit}>
                <div className='card p-5'>
                    <h2 className='text-sm font-semibold text-ink'>Thông tin chung</h2>
                    <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                        <Input label='Tiêu đề' name='title' value={form.title} onChange={handleChange} required />
                        <Input label='Thời gian (phút)' name='durationMinutes' type='number' value={form.durationMinutes} onChange={handleChange} min='1' />
                    </div>
                    <div className='mt-4'>
                        <Textarea label='Mô tả' name='description' value={form.description} onChange={handleChange} />
                    </div>
                    <div className='mt-4'>
                        <label className='block space-y-1.5'>
                            <span className='text-sm font-medium text-ink'>Độ khó</span>
                            <select name='difficulty' value={form.difficulty} onChange={handleChange} className='w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-primary'>
                                <option value='easy'>Dễ</option>
                                <option value='medium'>Trung bình</option>
                                <option value='hard'>Khó</option>
                            </select>
                        </label>
                    </div>
                </div>
                {questions.map((q, qi) => (
                    <div key={qi} className='card p-5'>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-sm font-semibold text-ink'>Câu {qi + 1}</h3>
                            {questions.length > 1 && <button type='button' onClick={() => removeQuestion(qi)} className='text-xs text-error hover:underline'>Xóa</button>}
                        </div>
                        <div className='mt-3'>
                            <Input label='Câu hỏi' value={q.question} onChange={(e) => updateQuestion(qi, 'question', e.target.value)} required />
                        </div>
                        <div className='mt-3 space-y-2'>
                            <span className='text-sm font-medium text-ink'>Lựa chọn</span>
                            {q.options.map((opt, oi) => (
                                <div key={oi} className='flex items-center gap-2'>
                                    <input type='radio' name={`correct-${qi}`} checked={q.correctAnswer === opt} onChange={() => updateQuestion(qi, 'correctAnswer', opt)} className='accent-primary' />
                                    <Input value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)} placeholder={`Lựa chọn ${oi + 1}`} className='flex-1' />
                                </div>
                            ))}
                            <button type='button' onClick={() => addOption(qi)} className='text-xs text-primary hover:underline'>+ Thêm lựa chọn</button>
                        </div>
                        <div className='mt-3'>
                            <Input label='Giải thích (tùy chọn)' value={q.explanation} onChange={(e) => updateQuestion(qi, 'explanation', e.target.value)} />
                        </div>
                    </div>
                ))}
                <Button type='button' variant='secondary' onClick={addQuestion}>+ Thêm câu hỏi</Button>
                <div className='flex gap-3'>
                    <Button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Đang tạo...' : 'Tạo quiz'}</Button>
                    <Button variant='secondary' onClick={() => navigate('/quizzes')}>Hủy</Button>
                </div>
            </form>
        </div>
    );
};

export default CreateQuizPage;
