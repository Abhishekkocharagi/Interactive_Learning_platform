import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourseSyllabus from './CourseSyllabus';
import CourseMaterials from './CourseMaterials';
import ReadingList from './ReadingList';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
    fetchUserProgress();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/courses/${id}`);
      const data = await response.json();
      setCourse(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course:', error);
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/1`);
      const userData = await response.json();
      const progress = userData.courseProgress?.find(
        (p) => p.courseId === parseInt(id)
      );
      setUserProgress(progress);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="error-container">
        <h2>Course not found</h2>
        <p>The course you're looking for doesn't exist.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: '📋 Overview', icon: '📋' },
    { id: 'syllabus', label: '📚 Syllabus', icon: '📚' },
    { id: 'materials', label: '📦 Materials', icon: '📦' },
    { id: 'readings', label: '📖 Readings', icon: '📖' },
  ];

  return (
    <div className="course-detail-page">
      <div className="course-header-section">
        <div className="course-header-content">
          <div className="course-header-text">
            <h1>{course.title}</h1>
            <p className="course-description">{course.description}</p>

            <div className="course-meta-info">
              <span className="meta-item">
                <strong>👤 Instructor:</strong> {course.instructor}
              </span>
              <span className="meta-item">
                <strong>⏱️ Duration:</strong> {course.duration}
              </span>
              <span className="meta-item">
                <strong>📊 Level:</strong> {course.level}
              </span>
              <span className="meta-item">
                <strong>⭐ Rating:</strong> {course.rating}/5
              </span>
            </div>

            <div className="course-stats">
              <div className="stat">
                <span className="stat-value">{course.lessons}</span>
                <span className="stat-label">Lessons</span>
              </div>
              <div className="stat">
                <span className="stat-value">{course.hours}h</span>
                <span className="stat-label">Total Hours</span>
              </div>
              <div className="stat">
                <span className="stat-value">{course.studentsEnrolled}</span>
                <span className="stat-label">Students</span>
              </div>
            </div>
          </div>

          {course.image && (
            <div className="course-header-image">
              <img src={course.image} alt={course.title} />
            </div>
          )}
        </div>
      </div>

      <div className="course-tabs">
        <div className="tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="course-content-section">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-grid">
              <div className="overview-card">
                <h2>🎯 What You'll Learn</h2>
                {course.learningOutcomes && (
                  <ul className="learning-outcomes">
                    {course.learningOutcomes.map((outcome, idx) => (
                      <li key={idx}>
                        <span className="checkmark">✓</span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="overview-card">
                  <h2>📋 Prerequisites</h2>
                  <ul className="prerequisites-list">
                    {course.prerequisites.map((prereq, idx) => (
                      <li key={idx}>{prereq}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="overview-card">
                <h2>ℹ️ Course Information</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Category:</span>
                    <span className="info-value">{course.category}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Price:</span>
                    <span className="info-value">${course.price}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Language:</span>
                    <span className="info-value">English</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Certificate:</span>
                    <span className="info-value">Yes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'syllabus' && course.syllabus && (
          <CourseSyllabus syllabus={course.syllabus} userProgress={userProgress} />
        )}

        {activeTab === 'materials' && course.materials && (
          <CourseMaterials
            materials={course.materials}
            downloadedMaterials={userProgress?.downloadedMaterials || []}
          />
        )}

        {activeTab === 'readings' && course.readings && (
          <ReadingList
            readings={course.readings}
            completedReadings={userProgress?.completedReadings || []}
            currentWeek={userProgress?.currentWeek || 1}
          />
        )}
      </div>
    </div>
  );
};

export default CourseDetail;