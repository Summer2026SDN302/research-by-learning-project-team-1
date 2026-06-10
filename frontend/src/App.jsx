import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import AppLayout from './components/layout/AppLayout.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';
import TeamsPage from './pages/teams/TeamsPage.jsx';
import CreateTeamPage from './pages/teams/CreateTeamPage.jsx';
import TeammatesPage from './pages/teams/TeammatesPage.jsx';
import CoursesPage from './pages/courses/CoursesPage.jsx';
import CreateCoursePage from './pages/courses/CreateCoursePage.jsx';
import MaterialsPage from './pages/materials/MaterialsPage.jsx';
import CreateMaterialPage from './pages/materials/CreateMaterialPage.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';
import QuizzesPage from './pages/quizzes/QuizzesPage.jsx';
import TakeQuizPage from './pages/quizzes/TakeQuizPage.jsx';
import CreateQuizPage from './pages/quizzes/CreateQuizPage.jsx';
import PostsPage from './pages/posts/PostsPage.jsx';
import CreatePostPage from './pages/posts/CreatePostPage.jsx';
import EventsPage from './pages/events/EventsPage.jsx';
import CreateEventPage from './pages/events/CreateEventPage.jsx';
import WorkspacePage from './pages/workspace/WorkspacePage.jsx';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className='grid min-h-screen place-items-center bg-bg text-ink'>Đang tải STE...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }

    return children;
};

const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to='/' replace />;
    }

    return children;
};

const App = () => {
    return (
        <Routes>
            <Route path='/login' element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path='/register' element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route
                path='/'
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<DashboardPage />} />
                <Route path='profile' element={<ProfilePage />} />
                <Route path='teams' element={<TeamsPage />} />
                <Route path='teams/create' element={<CreateTeamPage />} />
                <Route path='teams/:teamId/workspace' element={<WorkspacePage />} />
                <Route path='teammates' element={<TeammatesPage />} />
                <Route path='courses' element={<CoursesPage />} />
                <Route path='courses/create' element={<CreateCoursePage />} />
                <Route path='materials' element={<MaterialsPage />} />
                <Route path='materials/create' element={<CreateMaterialPage />} />
                <Route path='quizzes' element={<QuizzesPage />} />
                <Route path='quizzes/create' element={<CreateQuizPage />} />
                <Route path='quizzes/:id/take' element={<TakeQuizPage />} />
                <Route path='posts' element={<PostsPage />} />
                <Route path='posts/create' element={<CreatePostPage />} />
                <Route path='events' element={<EventsPage />} />
                <Route path='events/create' element={<CreateEventPage />} />
                <Route path='admin/users' element={<AdminUsersPage />} />
            </Route>
            <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
    );
};

export default App;
