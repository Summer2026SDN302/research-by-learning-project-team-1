import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PaperAirplaneIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import { getWorkspaceOverview, createTask, updateTask, deleteTask, uploadDocument, deleteDocument, createLink, deleteLink, getMessages, sendMessage } from '../../services/workspaceService.js';
import { useAuth } from '../../hooks/useAuth.js';

const taskStatusConfig = {
    todo: { label: 'Cần làm', className: 'bg-surface text-ink-secondary' },
    in_progress: { label: 'Đang làm', className: 'bg-[oklch(0.94_0.04_75)] text-[oklch(0.50_0.14_75)]' },
    review: { label: 'Xem xét', className: 'bg-[oklch(0.93_0.03_230)] text-[oklch(0.42_0.12_230)]' },
    done: { label: 'Xong', className: 'bg-success-light text-success' }
};

const priorityConfig = {
    low: 'text-muted',
    medium: 'text-ink-secondary',
    high: 'text-accent',
    urgent: 'text-error'
};

const WorkspacePage = () => {
    const { teamId } = useParams();
    const { user } = useAuth();
    const [overview, setOverview] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [newTask, setNewTask] = useState({ title: '', priority: 'medium' });
    const [newLink, setNewLink] = useState({ title: '', url: '', type: 'reference' });
    const [newDoc, setNewDoc] = useState({ title: '', fileUrl: '', fileName: '', category: 'document' });
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tasks');

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [overviewData, messagesData] = await Promise.all([
                getWorkspaceOverview(teamId),
                getMessages(teamId, { limit: 50 })
            ]);
            setOverview(overviewData);
            setMessages(messagesData.data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [teamId]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await createTask(teamId, newTask);
            setNewTask({ title: '', priority: 'medium' });
            toast.success('Đã tạo công việc');
            loadData();
        } catch (error) { toast.error(error.message); }
    };

    const handleUpdateTaskStatus = async (taskId, status) => {
        try {
            await updateTask(teamId, taskId, { status });
            loadData();
        } catch (error) { toast.error(error.message); }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(teamId, taskId);
            toast.success('Đã xóa');
            loadData();
        } catch (error) { toast.error(error.message); }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            await sendMessage(teamId, newMessage);
            setNewMessage('');
            const messagesData = await getMessages(teamId, { limit: 50 });
            setMessages(messagesData.data);
        } catch (error) { toast.error(error.message); }
    };

    const handleCreateLink = async (e) => {
        e.preventDefault();
        try {
            await createLink(teamId, newLink);
            setNewLink({ title: '', url: '', type: 'reference' });
            toast.success('Đã thêm liên kết');
            loadData();
        } catch (error) { toast.error(error.message); }
    };

    const handleUploadDoc = async (e) => {
        e.preventDefault();
        try {
            await uploadDocument(teamId, newDoc);
            setNewDoc({ title: '', fileUrl: '', fileName: '', category: 'document' });
            toast.success('Đã tải lên');
            loadData();
        } catch (error) { toast.error(error.message); }
    };

    const tabs = [
        { key: 'tasks', label: 'Công việc' },
        { key: 'documents', label: 'Tài liệu' },
        { key: 'links', label: 'Liên kết' },
        { key: 'messages', label: 'Tin nhắn' }
    ];

    if (isLoading) return <div className='card p-8 text-center text-sm text-muted'>Đang tải workspace...</div>;
    if (!overview) return null;

    return (
        <div className='space-y-6 animate-in'>
            <section>
                <h1 className='text-2xl font-bold tracking-tight text-ink'>Team Workspace</h1>
                <div className='mt-2 flex flex-wrap gap-3'>
                    {Object.entries(taskStatusConfig).map(([key, { label }]) => (
                        <span key={key} className='text-xs text-muted'>{label}: <strong className='text-ink'>{overview.taskStats?.[key === 'in_progress' ? 'inProgress' : key] || 0}</strong></span>
                    ))}
                </div>
            </section>

            <div className='flex gap-2 border-b border-border'>
                {tabs.map(({ key, label }) => (
                    <button key={key} onClick={() => setActiveTab(key)} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === key ? 'border-b-2 border-primary text-primary' : 'text-ink-secondary hover:text-ink'}`}>{label}</button>
                ))}
            </div>

            {activeTab === 'tasks' && (
                <section className='space-y-4'>
                    <form onSubmit={handleCreateTask} className='flex gap-2'>
                        <Input value={newTask.title} onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))} placeholder='Công việc mới...' className='flex-1' />
                        <select value={newTask.priority} onChange={(e) => setNewTask((p) => ({ ...p, priority: e.target.value }))} className='rounded-md border border-border bg-white px-2 py-1 text-xs text-ink'>
                            <option value='low'>Thấp</option><option value='medium'>TB</option><option value='high'>Cao</option><option value='urgent'>Khẩn</option>
                        </select>
                        <Button type='submit' size='sm'><PlusIcon className='h-4 w-4' /></Button>
                    </form>
                    <div className='space-y-2'>
                        {overview.tasks.map((task) => {
                            const config = taskStatusConfig[task.status] || taskStatusConfig.todo;
                            return (
                                <div key={task._id} className='card flex items-center gap-3 p-3'>
                                    <select value={task.status} onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)} className={`rounded-md px-2 py-0.5 text-xs font-medium border-0 ${config.className}`}>
                                        {Object.entries(taskStatusConfig).map(([k, { label }]) => <option key={k} value={k}>{label}</option>)}
                                    </select>
                                    <div className='min-w-0 flex-1'>
                                        <p className={`text-sm font-medium ${task.status === 'done' ? 'text-muted line-through' : 'text-ink'}`}>{task.title}</p>
                                        <div className='flex gap-2 text-xs text-muted'>
                                            <span className={priorityConfig[task.priority]}>{task.priority}</span>
                                            {task.assignees?.length > 0 && <span>{task.assignees.map((a) => a.name).join(', ')}</span>}
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteTask(task._id)} className='text-muted hover:text-error'><TrashIcon className='h-4 w-4' /></button>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {activeTab === 'documents' && (
                <section className='space-y-4'>
                    <form onSubmit={handleUploadDoc} className='card p-4'>
                        <div className='grid gap-3 sm:grid-cols-3'>
                            <Input value={newDoc.title} onChange={(e) => setNewDoc((p) => ({ ...p, title: e.target.value }))} placeholder='Tiêu đề' />
                            <Input value={newDoc.fileUrl} onChange={(e) => setNewDoc((p) => ({ ...p, fileUrl: e.target.value }))} placeholder='URL tệp' />
                            <Input value={newDoc.fileName} onChange={(e) => setNewDoc((p) => ({ ...p, fileName: e.target.value }))} placeholder='Tên tệp' />
                        </div>
                        <Button type='submit' size='sm' className='mt-3'>Tải lên</Button>
                    </form>
                    <div className='space-y-2'>
                        {overview.documents.map((doc) => (
                            <div key={doc._id} className='card flex items-center gap-3 p-3'>
                                <div className='min-w-0 flex-1'>
                                    <p className='text-sm font-medium text-ink'>{doc.title}</p>
                                    <p className='text-xs text-muted'>{doc.fileName} · {doc.uploadedBy?.name}</p>
                                </div>
                                <button onClick={() => { deleteDocument(teamId, doc._id); loadData(); }} className='text-muted hover:text-error'><TrashIcon className='h-4 w-4' /></button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {activeTab === 'links' && (
                <section className='space-y-4'>
                    <form onSubmit={handleCreateLink} className='card p-4'>
                        <div className='grid gap-3 sm:grid-cols-2'>
                            <Input value={newLink.title} onChange={(e) => setNewLink((p) => ({ ...p, title: e.target.value }))} placeholder='Tiêu đề' />
                            <Input value={newLink.url} onChange={(e) => setNewLink((p) => ({ ...p, url: e.target.value }))} placeholder='URL' />
                        </div>
                        <Button type='submit' size='sm' className='mt-3'>Thêm liên kết</Button>
                    </form>
                    <div className='space-y-2'>
                        {overview.links.map((link) => (
                            <div key={link._id} className='card flex items-center gap-3 p-3'>
                                <div className='min-w-0 flex-1'>
                                    <a href={link.url} target='_blank' rel='noopener noreferrer' className='text-sm font-medium text-primary hover:underline'>{link.title}</a>
                                    <p className='text-xs text-muted'>{link.type} · {link.createdBy?.name}</p>
                                </div>
                                <button onClick={() => { deleteLink(teamId, link._id); loadData(); }} className='text-muted hover:text-error'><TrashIcon className='h-4 w-4' /></button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {activeTab === 'messages' && (
                <section className='space-y-4'>
                    <div className='max-h-96 space-y-2 overflow-y-auto'>
                        {messages.map((msg) => (
                            <div key={msg._id} className={`flex gap-2 ${msg.sender?._id === user?._id ? 'justify-end' : ''}`}>
                                <div className={`max-w-[70%] rounded-lg px-3 py-2 ${msg.sender?._id === user?._id ? 'bg-primary text-white' : 'bg-surface text-ink'}`}>
                                    {msg.sender?._id !== user?._id && <p className='text-xs font-medium opacity-70'>{msg.sender?.name}</p>}
                                    <p className='text-sm'>{msg.content}</p>
                                    <p className={`mt-1 text-[10px] ${msg.sender?._id === user?._id ? 'text-white/60' : 'text-muted'}`}>{new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSendMessage} className='flex gap-2'>
                        <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder='Nhập tin nhắn...' className='flex-1' />
                        <Button type='submit'><PaperAirplaneIcon className='h-4 w-4' /></Button>
                    </form>
                </section>
            )}
        </div>
    );
};

export default WorkspacePage;
