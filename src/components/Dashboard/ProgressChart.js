import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ProgressChart = ({ userProgress, courses }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    // Prepare data for the chart
    const progressData = courses.map(course => {
      const progress = userProgress[course.id];
      if (!progress) return 0;
      return Math.round((progress.completed_lessons / course.total_lessons) * 100);
    });

    const courseLabels = courses.map(course => course.title.substring(0, 15) + '...');

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [{
          data: [
            Object.values(userProgress).filter(p => p.completed_lessons === courses.find(c => c.id === Object.keys(userProgress).find(key => userProgress[key] === p))?.total_lessons).length,
            Object.values(userProgress).filter(p => p.completed_lessons > 0 && p.completed_lessons < courses.find(c => c.id === Object.keys(userProgress).find(key => userProgress[key] === p))?.total_lessons).length,
            courses.length - Object.keys(userProgress).length
          ],
          backgroundColor: [
            '#4CAF50',
            '#FF9800',
            '#E0E0E0'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [userProgress, courses]);

  return (
    <div className="progress-chart-container">
      <h3>Learning Progress</h3>
      <div className="chart-wrapper">
        <canvas ref={chartRef} width="300" height="300"></canvas>
      </div>
    </div>
  );
};

export default ProgressChart;