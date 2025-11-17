import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import CourseManagement from './CourseManagement';
import StudentManagement from './StudentManagement';
import QuizManagement from './QuizManagement';
import Analytics from './Analytics';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalQuizzes: 0,
    activeEnrollments: 0,
  });
  const [activeMenu, setActiveMenu] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const coursesRes = await fetch('http://localhost:3001/courses');
      const studentsRes = await fetch('http://localhost:3001/users');
      const quizzesRes = await fetch('http://localhost:3001/quizzes');

      const courses = await coursesRes.json();
      const students = await studentsRes.json();
      const quizzes = await quizzesRes.json();

      const enrollments = students.reduce(
        (acc, student) => acc + (student.enrolledCourses?.length || 0),
        0
      );

      setStats({
        totalCourses: courses.length,
        totalStudents: students.length,
        totalQuizzes: quizzes.length,
        activeEnrollments: enrollments,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊', path: '/admin' },
    { id: 'courses', label: 'Courses', icon: '📚', path: '/admin/courses' },
    { id: 'students', label: 'Students', icon: '👥', path: '/admin/students' },
    { id: 'quizzes', label: 'Quizzes', icon: '📝', path: '/admin/quizzes' },
    { id: 'analytics', label: 'Analytics', icon: '📈', path: '/admin/analytics' },
  ];

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>🎓 Admin Panel</h2>
          <p className="admin-subtitle">Learning Platform</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => navigate('/')}>
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Routes>
          <Route
            path="/"
            element={
              <div className="overview-section">
                <header className="content-header">
                  <h1>Dashboard Overview</h1>
                  <p>Welcome back! Here's what's happening with your platform.</p>
                </header>

                <div className="stats-grid">
                  <div className="stat-card courses">
                    <div className="stat-icon">📚</div>
                    <div className="stat-info">
                      <h3>{stats.totalCourses}</h3>
                      <p>Total Courses</p>
                    </div>
                  </div>

                  <div className="stat-card students">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                      <h3>{stats.totalStudents}</h3>
                      <p>Total Students</p>
                    </div>
                  </div>

                  <div className="stat-card quizzes">
                    <div className="stat-icon">📝</div>
                    <div className="stat-info">
                      <h3>{stats.totalQuizzes}</h3>
                      <p>Total Quizzes</p>
                    </div>
                  </div>

                  <div className="stat-card enrollments">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                      <h3>{stats.activeEnrollments}</h3>
                      <p>Active Enrollments</p>
                    </div>
                  </div>
                </div>

                <div className="quick-actions">
                  <h2>Quick Actions</h2>
                  <div className="actions-grid">
                    <button
                      className="action-btn"
                      onClick={() => {
                        setActiveMenu('courses');
                        navigate('/admin/courses');
                      }}
                    >
                      <span className="action-icon">➕</span>
                      <span>Add New Course</span>
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => {
                        setActiveMenu('students');
                        navigate('/admin/students');
                      }}
                    >
                      <span className="action-icon">👤</span>
                      <span>Add Student</span>
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => {
                        setActiveMenu('quizzes');
                        navigate('/admin/quizzes');
                      }}
                    >
                      <span className="action-icon">📝</span>
                      <span>Create Quiz</span>
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => {
                        setActiveMenu('analytics');
                        navigate('/admin/analytics');
                      }}
                    >
                      <span className="action-icon">📊</span>
                      <span>View Analytics</span>
                    </button>
                  </div>
                </div>

                <div className="recent-activity">
                  <h2>Recent Activity</h2>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span className="activity-icon">📚</span>
                      <div className="activity-info">
                        <p className="activity-title">New course added</p>
                        <p className="activity-time">2 hours ago</p>
                      </div>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">👤</span>
                      <div className="activity-info">
                        <p className="activity-title">5 new students enrolled</p>
                        <p className="activity-time">5 hours ago</p>
                      </div>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">✅</span>
                      <div className="activity-info">
                        <p className="activity-title">12 quizzes completed</p>
                        <p className="activity-time">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/courses" element={<CourseManagement />} />
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/quizzes" element={<QuizManagement />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;