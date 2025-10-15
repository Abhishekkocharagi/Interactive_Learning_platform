import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import CourseCard from '../Course/CourseCard';
import ProgressChart from './ProgressChart';
import SearchBar from '../Common/SearchBar';
import { getCourses, getUserProgress } from '../../services/courseService';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, selectedDifficulty, courses]);

  const loadData = async () => {
    try {
      const coursesData = await getCourses();
      setCourses(coursesData);

      if (user) {
        const progressData = await getUserProgress(user.id);
        setUserProgress(progressData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(course => course.difficulty_level === selectedDifficulty);
    }

    setFilteredCourses(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const getOverallProgress = () => {
    if (!user || courses.length === 0) return 0;
    
    const totalCourses = courses.length;
    const completedCourses = Object.values(userProgress).filter(
      progress => progress.completed_percentage === 100
    ).length;
    
    return Math.round((completedCourses / totalCourses) * 100);
  };

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="welcome-section">
          <h1>Welcome to CodeLearn Platform</h1>
          <p>Please login to access your personalized learning dashboard</p>
          <div className="course-grid">
            {courses.slice(0, 6).map(course => (
              <CourseCard key={course.id} course={course} showPreview={true} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-message">
          <h1>Welcome back, {user.name}!</h1>
          <p>Continue your learning journey</p>
        </div>
        <div className="progress-summary">
          <div className="progress-card">
            <h3>Overall Progress</h3>
            <div className="progress-circle">
              <span>{getOverallProgress()}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="sidebar">
          <ProgressChart userProgress={userProgress} courses={courses} />
          <div className="quick-stats">
            <h3>Quick Stats</h3>
            <div className="stat-item">
              <span>Courses Enrolled:</span>
              <span>{Object.keys(userProgress).length}</span>
            </div>
            <div className="stat-item">
              <span>Lessons Completed:</span>
              <span>{Object.values(userProgress).reduce((acc, curr) => acc + (curr.completed_lessons || 0), 0)}</span>
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="filters-section">
            <SearchBar onSearch={handleSearch} />
            <div className="difficulty-filter">
              <label>Filter by Difficulty:</label>
              <select 
                value={selectedDifficulty} 
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="courses-section">
            <h2>Available Courses ({filteredCourses.length})</h2>
            <div className="course-grid">
              {filteredCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course}
                  progress={userProgress[course.id]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;