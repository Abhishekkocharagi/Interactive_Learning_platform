import React, { useState } from 'react';
import './ReadingList.css';

const ReadingList = ({ readings, completedReadings = [], currentWeek = 1 }) => {
  const [filterWeek, setFilterWeek] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const isCompleted = (readingId) => {
    return completedReadings.includes(readingId);
  };

  const isCurrentWeek = (week) => {
    return week === currentWeek;
  };

  const filteredReadings = readings.filter((reading) => {
    const matchesWeek = filterWeek === 'all' || reading.week === parseInt(filterWeek);
    const matchesType = filterType === 'all' || reading.type === filterType;
    return matchesWeek && matchesType;
  });

  const weeks = [...new Set(readings.map((r) => r.week))].sort((a, b) => a - b);

  const totalEstimatedTime = filteredReadings.reduce((total, reading) => {
    const minutes = parseInt(reading.estimatedTime);
    return total + (isNaN(minutes) ? 0 : minutes);
  }, 0);

  const toggleReadingComplete = (readingId) => {
    console.log('Toggle reading:', readingId);
  };

  const getReadingsByWeek = () => {
    const grouped = {};
    filteredReadings.forEach((reading) => {
      if (!grouped[reading.week]) {
        grouped[reading.week] = [];
      }
      grouped[reading.week].push(reading);
    });
    return grouped;
  };

  const readingsByWeek = getReadingsByWeek();

  return (
    <div className="reading-list">
      <div className="reading-header">
        <h2>📚 Course Readings</h2>
        <p className="reading-subtitle">
          Curated articles, documentation, and resources to deepen your understanding
        </p>
      </div>

      <div className="reading-filters">
        <div className="filter-group">
          <label>Week:</label>
          <select value={filterWeek} onChange={(e) => setFilterWeek(e.target.value)}>
            <option value="all">All Weeks</option>
            {weeks.map((week) => (
              <option key={week} value={week}>
                Week {week} {isCurrentWeek(week) && '(Current)'}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Type:</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="required">Required</option>
            <option value="recommended">Recommended</option>
            <option value="optional">Optional</option>
          </select>
        </div>

        <div className="reading-stats-mini">
          <span className="stat">
            📖 {filteredReadings.length} readings
          </span>
          <span className="stat">
            ⏱️ ~{totalEstimatedTime} mins total
          </span>
        </div>
      </div>

      <div className="readings-content">
        {Object.keys(readingsByWeek).length > 0 ? (
          Object.keys(readingsByWeek)
            .sort((a, b) => a - b)
            .map((week) => (
              <div key={week} className="week-readings">
                <div className="week-readings-header">
                  <h3>
                    Week {week}
                    {isCurrentWeek(parseInt(week)) && (
                      <span className="current-week-badge">Current Week</span>
                    )}
                  </h3>
                  <span className="week-reading-count">
                    {readingsByWeek[week].length} reading
                    {readingsByWeek[week].length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="readings-list">
                  {readingsByWeek[week].map((reading) => {
                    const completed = isCompleted(reading.id);
                    
                    return (
                      <div
                        key={reading.id}
                        className={`reading-item ${completed ? 'completed' : ''}`}
                      >
                        <div className="reading-checkbox">
                          <input
                            type="checkbox"
                            checked={completed}
                            onChange={() => toggleReadingComplete(reading.id)}
                            id={`reading-${reading.id}`}
                          />
                          <label htmlFor={`reading-${reading.id}`}></label>
                        </div>

                        <div className="reading-content">
                          <div className="reading-title-row">
                            <h4>{reading.title}</h4>
                            <span
                              className={`reading-type-badge ${reading.type}`}
                            >
                              {reading.type}
                            </span>
                          </div>

                          <div className="reading-meta">
                            <span className="reading-time">
                              ⏱️ {reading.estimatedTime}
                            </span>
                            <a
                              href={reading.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="reading-link"
                            >
                              🔗 Open Resource
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
        ) : (
          <div className="no-readings">
            <p>No readings found for the selected filters.</p>
          </div>
        )}
      </div>

      <div className="reading-progress">
        <h3>Reading Progress</h3>
        <div className="progress-bars">
          <div className="progress-item">
            <div className="progress-label">
              <span>Overall Progress</span>
              <span className="progress-percentage">
                {Math.round((completedReadings.length / readings.length) * 100)}%
              </span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${(completedReadings.length / readings.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="progress-stats">
            <div className="stat-box">
              <span className="stat-number">{completedReadings.length}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">
                {readings.length - completedReadings.length}
              </span>
              <span className="stat-label">Remaining</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">
                {readings.filter((r) => r.type === 'required').length}
              </span>
              <span className="stat-label">Required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingList;