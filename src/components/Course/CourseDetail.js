import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { getCourseDetail, enrollInCourse } from '../../services/courseService';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    loadCourseDetail();
  }, [id]);

  const loadCourseDetail = async () => {
    try {
      const courseData = await getCourseDetail(id);
      setCourse(courseData.course);
      setLessons(courseData.lessons);
      setEnrolled(courseData.enrolled);
    } catch (error) {
      console.error('Failed to load course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      alert('Please login to enroll in courses');
      return;
    }

    try {
      await enrollInCourse(user.id, id);
      setEnrolled(true);
    } catch (error) {
      console.error('Failed to enroll:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading course details...</div>;
  }

  if (!course) {
    return <div className="error">Course not found</div>;
  }

  return (
    <div className="course-detail">
      <div className="course-header">
        <Link to="/" className="back-link">← Back to Dashboard</Link>
        <div className="course-info">
          <h1>{course.title}</h1>
          <p className="course-description">{course.description}</p>
          <div className="course-meta">
            <span className="difficulty">{course.difficulty_level}</span>
            <span className="duration">{course.duration_hours} hours</span>
            <span className="lessons">{course.total_lessons} lessons</span>
          </div>
        </div>
        {!enrolled && (
          <button onClick={handleEnroll} className="btn-primary enroll-btn">
            Enroll Now
          </button>
        )}
      </div>

      <div className="lessons-list">
        <h2>Course Content</h2>
        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="lesson-item">
            <div className="lesson-info">
              <h3>Lesson {index + 1}: {lesson.title}</h3>
              <p>{lesson.description || 'Complete this lesson to continue your progress'}</p>
            </div>
            {enrolled ? (
              <Link 
                to={`/lesson/${id}/${lesson.id}`}
                className="btn-secondary"
              >
                Start Lesson
              </Link>
            ) : (
              <button className="btn-secondary" disabled>
                Enroll to Access
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetail;
