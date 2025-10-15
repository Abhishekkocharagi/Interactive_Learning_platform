import React from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.css';

const CourseCard = ({ course, progress, showPreview = false }) => {
  const getProgressPercentage = () => {
    if (!progress) return 0;
    return Math.round((progress.completed_lessons / course.total_lessons) * 100);
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <div className="course-card">
      <div className="course-image">
        <img 
          src={course.image_url || '/placeholder-course.jpg'} 
          alt={course.title}
          onError={(e) => {
            e.target.src = '/placeholder-course.jpg';
          }}
        />
        <div 
          className="difficulty-badge"
          style={{ backgroundColor: getDifficultyColor(course.difficulty_level) }}
        >
          {course.difficulty_level}
        </div>
      </div>

      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">{course.description}</p>
        
        <div className="course-stats">
          <div className="stat">
            <span className="stat-icon">📚</span>
            <span>{course.total_lessons} lessons</span>
          </div>
          <div className="stat">
            <span className="stat-icon">⏱️</span>
            <span>{course.duration_hours} hours</span>
          </div>
        </div>

        {progress && !showPreview && (
          <div className="progress-section">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <span className="progress-text">{getProgressPercentage()}% Complete</span>
          </div>
        )}

        <div className="course-actions">
          {showPreview ? (
            <button className="btn-secondary" disabled>
              Login to Start
            </button>
          ) : (
            <Link 
              to={`/course/${course.id}`}
              className="btn-primary"
            >
              {progress ? 'Continue Learning' : 'Start Course'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;