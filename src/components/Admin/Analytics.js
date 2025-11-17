import React, { useState, useEffect } from 'react';
import './Analytics.css';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalCourses: 0,
    totalStudents: 0,
    activeStudents: 0,
    completionRate: 0,
    averageRating: 0,
    popularCourses: [],
    recentEnrollments: [],
    categoryDistribution: [],
    monthlyRevenue: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [coursesRes, usersRes, categoriesRes] = await Promise.all([
        fetch('http://localhost:3001/courses'),
        fetch('http://localhost:3001/users'),
        fetch('http://localhost:3001/categories'),
      ]);

      const courses = await coursesRes.json();
      const users = await usersRes.json();
      const categories = await categoriesRes.json();

      const totalRevenue = courses.reduce((sum, course) => 
        sum + (course.price * course.studentsEnrolled), 0
      );

      const activeStudents = users.filter(u => u.status === 'active').length;
      
      const totalEnrollments = users.reduce((sum, u) => 
        sum + (u.enrolledCourses?.length || 0), 0
      );

      const totalCompletions = users.reduce((sum, u) => 
        sum + (u.completedCourses?.length || 0), 0
      );

      const completionRate = totalEnrollments > 0 
        ? (totalCompletions / totalEnrollments) * 100 
        : 0;

      const averageRating = courses.reduce((sum, c) => sum + c.rating, 0) / courses.length;

      const popularCourses = [...courses]
        .sort((a, b) => b.studentsEnrolled - a.studentsEnrolled)
        .slice(0, 5);

      const recentEnrollments = users
        .slice(-5)
        .reverse()
        .map(user => ({
          studentName: user.name,
          courseName: courses[0]?.title || 'Unknown',
          date: user.joinDate,
        }));

      const categoryDistribution = categories.map(cat => ({
        name: cat.name,
        count: cat.courseCount,
        percentage: (cat.courseCount / courses.length) * 100,
      }));

      const monthlyRevenue = [
        { month: 'Jan', revenue: 12500 },
        { month: 'Feb', revenue: 15800 },
        { month: 'Mar', revenue: 18200 },
        { month: 'Apr', revenue: 21000 },
        { month: 'May', revenue: 19500 },
        { month: 'Jun', revenue: 23400 },
      ];

      setAnalytics({
        totalRevenue,
        totalCourses: courses.length,
        totalStudents: users.length,
        activeStudents,
        completionRate: completionRate.toFixed(1),
        averageRating: averageRating.toFixed(1),
        popularCourses,
        recentEnrollments,
        categoryDistribution,
        monthlyRevenue,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <div className="analytics-dashboard">
      <header className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <p>Comprehensive insights and performance metrics</p>
      </header>

      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-info">
            <h3>${analytics.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
            <span className="metric-change positive">+12.5%</span>
          </div>
        </div>

        <div className="metric-card courses">
          <div className="metric-icon">📚</div>
          <div className="metric-info">
            <h3>{analytics.totalCourses}</h3>
            <p>Total Courses</p>
            <span className="metric-change positive">+3</span>
          </div>
        </div>

        <div className="metric-card students">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <h3>{analytics.totalStudents}</h3>
            <p>Total Students</p>
            <span className="metric-change positive">+45</span>
          </div>
        </div>

        <div className="metric-card active">
          <div className="metric-icon">✅</div>
          <div className="metric-info">
            <h3>{analytics.activeStudents}</h3>
            <p>Active Students</p>
            <span className="metric-change">{analytics.completionRate}%</span>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>📈 Monthly Revenue</h3>
          <div className="bar-chart">
            {analytics.monthlyRevenue.map((data, index) => (
              <div key={index} className="bar-container">
                <div
                  className="bar"
                  style={{
                    height: `${(data.revenue / 25000) * 100}%`,
                  }}
                  title={`$${data.revenue.toLocaleString()}`}
                ></div>
                <span className="bar-label">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>📊 Category Distribution</h3>
          <div className="category-chart">
            {analytics.categoryDistribution.map((cat, index) => (
              <div key={index} className="category-item">
                <div className="category-info">
                  <span className="category-name">{cat.name}</span>
                  <span className="category-count">{cat.count} courses</span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
                <span className="percentage">{cat.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tables-section">
        <div className="table-card">
          <h3>🏆 Popular Courses</h3>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Students</th>
                <th>Rating</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics.popularCourses.map((course) => (
                <tr key={course.id}>
                  <td>
                    <strong>{course.title}</strong>
                  </td>
                  <td>{course.instructor}</td>
                  <td>{course.studentsEnrolled}</td>
                  <td>⭐ {course.rating}</td>
                  <td>${(course.price * course.studentsEnrolled).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-card">
          <h3>🆕 Recent Enrollments</h3>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentEnrollments.map((enrollment, index) => (
                <tr key={index}>
                  <td>{enrollment.studentName}</td>
                  <td>{enrollment.courseName}</td>
                  <td>{new Date(enrollment.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="performance-summary">
        <h3>📊 Performance Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Average Course Rating</span>
            <span className="summary-value">⭐ {analytics.averageRating}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Completion Rate</span>
            <span className="summary-value">{analytics.completionRate}%</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Avg. Students per Course</span>
            <span className="summary-value">
              {analytics.totalCourses > 0
                ? Math.round(
                    analytics.popularCourses.reduce(
                      (sum, c) => sum + c.studentsEnrolled,
                      0
                    ) / analytics.popularCourses.length
                  )
                : 0}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Revenue per Student</span>
            <span className="summary-value">
              $
              {analytics.totalStudents > 0
                ? (analytics.totalRevenue / analytics.totalStudents).toFixed(2)
                : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;