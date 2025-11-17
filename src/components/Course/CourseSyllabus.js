import React, { useState } from 'react';
import './CourseSyllabus.css';

const CourseSyllabus = ({ syllabus, userProgress }) => {
  const [expandedWeek, setExpandedWeek] = useState(null);

  const toggleWeek = (weekNum) => {
    setExpandedWeek(expandedWeek === weekNum ? null : weekNum);
  };

  const isWeekCompleted = (weekNum) => {
    return userProgress?.completedWeeks?.includes(weekNum) || false;
  };

  const isWeekCurrent = (weekNum) => {
    return userProgress?.currentWeek === weekNum;
  };

  return (
    <div className="course-syllabus">
      <div className="syllabus-header">
        <h2>📚 Course Syllabus</h2>
        <p className="syllabus-subtitle">
          {syllabus.length} weeks of comprehensive learning
        </p>
      </div>

      <div className="syllabus-content">
        {syllabus.map((week) => {
          const isCompleted = isWeekCompleted(week.week);
          const isCurrent = isWeekCurrent(week.week);
          const isExpanded = expandedWeek === week.week;

          return (
            <div
              key={week.week}
              className={`week-card ${isCompleted ? 'completed' : ''} ${
                isCurrent ? 'current' : ''
              }`}
            >
              <div
                className="week-header"
                onClick={() => toggleWeek(week.week)}
              >
                <div className="week-title-section">
                  <div className="week-number">
                    {isCompleted ? '✓' : week.week}
                  </div>
                  <div className="week-info">
                    <h3>{week.title}</h3>
                    <span className="week-meta">
                      Week {week.week} • {week.topics.length} topics
                      {week.quiz && ' • Quiz'}
                      {week.finalProject && ' • Final Project'}
                    </span>
                  </div>
                </div>
                <div className="week-status">
                  {isCurrent && (
                    <span className="status-badge current">Current</span>
                  )}
                  {isCompleted && (
                    <span className="status-badge completed">Completed</span>
                  )}
                  <span className={`expand-icon ${isExpanded ? 'open' : ''}`}>
                    ▼
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="week-details">
                  <div className="detail-section">
                    <h4>📖 Topics Covered</h4>
                    <ul className="topics-list">
                      {week.topics.map((topic, idx) => (
                        <li key={idx}>{topic}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="detail-section">
                    <h4>🎯 Learning Objectives</h4>
                    <ul className="objectives-list">
                      {week.learningObjectives.map((obj, idx) => (
                        <li key={idx}>{obj}</li>
                      ))}
                    </ul>
                  </div>

                  {week.assignments && week.assignments.length > 0 && (
                    <div className="detail-section">
                      <h4>✍️ Assignments</h4>
                      <ul className="assignments-list">
                        {week.assignments.map((assignment, idx) => (
                          <li key={idx}>
                            <span className="assignment-name">{assignment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="week-extras">
                    {week.quiz && (
                      <div className="extra-item quiz">
                        <span className="icon">📝</span>
                        <span>Weekly Quiz Available</span>
                      </div>
                    )}
                    {week.finalProject && (
                      <div className="extra-item project">
                        <span className="icon">🚀</span>
                        <span>Final Project Week</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {userProgress && (
        <div className="progress-summary">
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{
                width: `${
                  (userProgress.completedWeeks?.length / syllabus.length) * 100
                }%`,
              }}
            ></div>
          </div>
          <p className="progress-text">
            {userProgress.completedWeeks?.length || 0} of {syllabus.length}{' '}
            weeks completed
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseSyllabus;