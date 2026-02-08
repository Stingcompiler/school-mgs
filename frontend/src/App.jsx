import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import Unauthorized from './pages/Unauthorized'
import DashboardLayout from './components/dashboard/DashboardLayout'
import DashboardHome from './pages/dashboard/DashboardHome'
import StudentList from './pages/dashboard/StudentList'
import StudentDetail from './pages/dashboard/StudentDetail'
import StudentForm from './pages/dashboard/StudentForm'
import Finance from './pages/dashboard/Finance'
import Results from './pages/dashboard/Results'
import Messages from './pages/dashboard/Messages'
import RequireAuth from './components/RequireAuth'

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* Protected Dashboard Routes */}
                    <Route path="/dashboard" element={
                        <RequireAuth>
                            <DashboardLayout />
                        </RequireAuth>
                    }>
                        <Route index element={<DashboardHome />} />
                        <Route path="students" element={<StudentList />} />
                        <Route path="students/new" element={<StudentForm />} />
                        <Route path="students/:id" element={<StudentDetail />} />
                        <Route path="students/:id/edit" element={<StudentForm />} />
                        <Route path="finance" element={<Finance />} />
                        <Route path="results" element={<Results />} />
                        <Route path="messages" element={<Messages />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
