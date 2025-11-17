import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ProgressChart = ({ userProgress, courses }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Destroy previous chart instance if exists to avoid duplicates
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    // Initialize counters for chart data
    let completedCount = 0;
    let inProgressCount = 0;
    let notStartedCount = 0;

    // Iterate through courses and categorize progress
    courses.forEach(course => {
      const progress = userProgress[course.id];
      if (progress) {
        if (progress.completed_lessons === course.total_lessons) {
          completedCount++;
        } else if (progress.completed_lessons > 0 && progress.completed_lessons < course.total_lessons) {
          inProgressCount++;
        } else {
          notStartedCount++; // progress exists but no lessons completed
        }
      } else {
        notStartedCount++; // no progress info for this course
      }
    });

    // Create doughnut chart instance
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [{
          data: [completedCount, inProgressCount, notStartedCount],
          backgroundColor: ['#4CAF50', '#FF9800', '#E0E0E0'],
          borderWidth: 2,
          borderColor: '#fff',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });

    // Cleanup on unmount or before re-running
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };

  }, [userProgress, courses]);

  return (
    <div className="progress-chart-container" style={{ height: '300px', width: '300px' }}>
      <h3>Learning Progress</h3>
      <div className="chart-wrapper" style={{ position: 'relative', height: '100%', width: '100%' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default ProgressChart;
