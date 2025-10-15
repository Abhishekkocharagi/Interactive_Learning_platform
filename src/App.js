import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/StudentDashboard';
import CourseDetail from './components/Course/CourseDetail';
import LessonViewer from './components/Course/LessonViewer';
import { AuthProvider } from './components/Auth/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/lesson/:courseId/:lessonId" element={<LessonViewer />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
// import React, { useEffect, useState } from 'react';
// import { api } from './services/api';
// import './App.css';

// function App() {
//   const [courses, setCourses] = useState([]);
//   const [connectionStatus, setConnectionStatus] = useState('Testing...');

//   useEffect(() => {
//     testDatabaseConnection();
//   }, []);

//   const testDatabaseConnection = async () => {
//     // Test connection
//     const isConnected = await api.testConnection();
    
//     if (isConnected) {
//       setConnectionStatus('✅ Database Connected!');
//       // Load courses
//       const coursesData = await api.getCourses();
//       setCourses(coursesData);
//     } else {
//       setConnectionStatus('❌ Database Connection Failed');
//     }
//   };

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>CodeLearn Platform</h1>
//         <div className="connection-status">
//           <h3>{connectionStatus}</h3>
//         </div>
        
//         {courses.length > 0 && (
//           <div className="courses-test">
//             <h3>Courses from Database:</h3>
//             {courses.map(course => (
//               <div key={course.id} style={{border: '1px solid #ccc', margin: '10px', padding: '10px'}}>
//                 <h4>{course.title}</h4>
//                 <p>{course.description}</p>
//                 <p>Level: {course.level} | Price: ${course.price}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </header>
//     </div>
//   );
// }

// export default App;