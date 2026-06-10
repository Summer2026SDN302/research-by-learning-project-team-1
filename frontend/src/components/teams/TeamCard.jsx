import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../common/Button.jsx';
import TagList from '../common/TagList.jsx';
import Textarea from '../common/Textarea.jsx';
import ScoreBadge from './ScoreBadge.jsx';
import { sendJoinRequest } from '../../services/teamService.js';

const statusConfig = {
    open: { label: 'Đang tuyển', variant: 'green' },
    closed: { label: 'Đã đóng', variant: 'neutral' },
    in_progress: { label: 'Đang làm', variant: 'amber' },
    completed: { label: 'Hoàn thành', variant: 'blue' }
};

const statusTone = {
    green: 'bg-primary-light text-primary',
    neutral: 'bg-surface text-ink-secondary',
    amber: 'bg-[oklch(0.94_0.04_75)] text-[oklch(0.50_0.14_75)]',
    blue: 'bg-[oklch(0.93_0.03_230)] text-[oklch(0.42_0.12_230)]'
};

const TeamCard = ({ team, showScore = false }) => {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const score = team.compatibilityScore?.total ?? 0;
    const config = statusConfig[team.status] || statusConfig.open;

    const handleJoin = async () => {
        setIsSending(true);

        try {
            await sendJoinRequest(team._id, message);
            toast.success('Đã gửi yêu cầu tham gia');
            setMessage('');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <article className='card animate-in p-5'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                <div className='min-w-0 flex-1'>
                    <div className='flex flex-wrap items-center gap-2'>
                        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusTone[config.variant]}`}>
                            {config.label}
                        </span>
                        <span className='text-xs text-muted'>
                            {team.members?.length ?? team.memberCount ?? 0}/{team.maxMembers} thành viên
                        </span>
                    </div>
                    <h3 className='mt-2 text-base font-semibold text-ink'>{team.name}</h3>
                    <p className='mt-1.5 text-sm leading-relaxed text-ink-secondary'>{team.description}</p>
                </div>
                {showScore && <ScoreBadge score={score} />}
            </div>

            <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                <div className='rounded-md bg-surface p-3'>
                    <p className='mb-2 text-xs font-medium text-muted'>Kỹ năng cần có</p>
                    <TagList items={team.requiredSkills} />
                </div>
                <div className='rounded-md bg-surface p-3'>
                    <p className='mb-2 text-xs font-medium text-muted'>Chủ đề</p>
                    <TagList items={team.tags} tone='blue' />
                </div>
            </div>

            <div className='mt-4 rounded-md border border-border p-3'>
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Lý do bạn phù hợp với nhóm này...'
                    maxLength={500}
                />
                <div className='mt-2 flex justify-end'>
                    <Button size='sm' onClick={handleJoin} disabled={isSending}>
                        {isSending ? 'Đang gửi...' : 'Gửi yêu cầu'}
                    </Button>
                </div>
            </div>
        </article>
    );
};

export default TeamCard;