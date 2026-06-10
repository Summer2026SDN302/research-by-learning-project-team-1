import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button.jsx';
import { getQuizById, submitQuiz } from '../../services/quizService.js';

const TakeQuizPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const data = await getQuizById(id);
                setQuiz(data);
            } catch (error) {
                toast.error(error.message);
                navigate('/quizzes');
            } finally {
                setIsLoading(false);
            }
        };
        loadQuiz();
    }, [id, navigate]);

    const handleSelect = (questionId, option) => {
        setAnswers((prev) => ({ ...prev, [questionId]: option }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const answerList = quiz.questions.map((q) => ({
                questionId: q._id,
                selectedAnswer: answers[q._id] || '',
            }));
            const attempt = await submitQuiz(id, answerList);
            setResult(attempt);
            toast.success(`Điểm: ${attempt.percentage}%`);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className='card p-8 text-center text-sm text-muted'>Đang tải quiz...</div>;
    if (!quiz) return null;

    if (result) {
        return (
            <div className='space-y-6 animate-in'>
                <section>
                    <h1 className='text-2xl font-bold tracking-tight text-ink'>Kết quả: {quiz.title}</h1>
                    <div className='mt-4 grid gap-4 sm:grid-cols-3'>
                        <div className='card p-5 text-center'>
                            <p className='text-xs font-medium text-muted'>Điểm</p>
                            <p className='mt-1 text-3xl font-bold text-primary'>{result.percentage}%</p>
                        </div>
                        <div className='card p-5 text-center'>
                            <p className='text-xs font-medium text-muted'>Đúng/Sai</p>
                            <p className='mt-1 text-lg font-semibold text-ink'>{result.answers.filter((a) => a.isCorrect).length}/{result.answers.length}</p>
                        </div>
                        <div className='card p-5 text-center'>
                            <p className='text-xs font-medium text-muted'>Điểm số</p>
                            <p className='mt-1 text-lg font-semibold text-ink'>{result.score}/{result.totalPoints}</p>
                        </div>
                    </div>
                </section>
                <section className='space-y-3'>
                    {result.answers.map((ans, i) => {
                        const question = quiz.questions[i];
                        return (
                            <div key={i} className={`card p-4 ${ans.isCorrect ? 'border-success' : 'border-error'}`}>
                                <p className='text-sm font-medium text-ink'>{question?.question}</p>
                                <p className='mt-2 text-sm'>
                                    <span className={ans.isCorrect ? 'text-success' : 'text-error'}>
                                        Bạn chọn: {ans.selectedAnswer || '(bỏ trống)'}
                                    </span>
                                </p>
                                {!ans.isCorrect && question && (
                                    <p className='mt-1 text-sm text-success'>Đáp án đúng: {question.correctAnswer}</p>
                                )}
                            </div>
                        );
                    })}
                </section>
                <Button onClick={() => navigate('/quizzes')}>Quay lại danh sách</Button>
            </div>
        );
    }

    return (
        <div className='animate-in'>
            <section>
                <h1 className='text-2xl font-bold tracking-tight text-ink'>{quiz.title}</h1>
                <p className='mt-1.5 text-sm text-ink-secondary'>{quiz.description}</p>
                <p className='mt-2 text-xs text-muted'>{quiz.questions.length} câu · {quiz.durationMinutes} phút</p>
            </section>
            <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
                {quiz.questions.map((q, i) => (
                    <div key={q._id} className='card p-5'>
                        <p className='text-sm font-medium text-ink'>
                            <span className='text-primary'>{i + 1}.</span> {q.question}
                        </p>
                        <div className='mt-3 space-y-2'>
                            {q.options.map((opt) => (
                                <label key={opt} className='flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 transition-colors hover:bg-surface'>
                                    <input type='radio' name={q._id} value={opt} checked={answers[q._id] === opt} onChange={() => handleSelect(q._id, opt)} className='accent-primary' />
                                    <span className='text-sm text-ink'>{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
                <Button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Đang nộp...' : 'Nộp bài'}</Button>
            </form>
        </div>
    );
};

export default TakeQuizPage;
