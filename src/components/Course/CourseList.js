// // src/components/Courses/CourseList.js
// import React, { useState, useEffect } from 'react';
// import { api } from '../../services/api';
// import './CourseList.css';

// const CourseList = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     fetchCourses();
//     fetchCategories();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       setLoading(true);
//       const data = await api.getCourses();
//       setCourses(data);
//     } catch (err) {
//       setError('Failed to load courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const data = await api.getCategories();
//       setCategories(data);
//     } catch (err) {
//       console.error('Failed to load categories');
//     }
//   };

//   const filteredCourses = courses.filter(course => {
//     const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const handleEnroll = async (courseId) => {
//     try {
//       // Assuming user ID is 1 for demo
//       await api.enrollInCourse(1, courseId);
//       alert('Successfully enrolled in course!');
//     } catch (err) {
//       alert('Failed to enroll in course');
//     }
//   };

//   if (loading) return <div className="loading">Loading courses...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="course-list-container">
//       <div className="course-filters">
//         <div className="search-section">
//           <input
//             type="text"
//             placeholder="Search courses..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//         </div>
        
//         <div className="category-filters">
//           <button 
//             className={selectedCategory === 'all' ? 'active' : ''}
//             onClick={() => setSelectedCategory('all')}
//           >
//             All Courses
//           </button>
//           {categories.map(category => (
//             <button
//               key={category.id}
//               className={selectedCategory === category.name ? 'active' : ''}
//               onClick={() => setSelectedCategory(category.name)}
//             >
//               {category.icon} {category.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="courses-grid">
//         {filteredCourses.map(course => (
//           <div key={course.id} className="course-card">
//             <div className="course-image">
//               <img 
//                 src={course.image} 
//                 alt={course.title}
//                 onError={(e) => {
//                   e.target.src = `https://via.placeholder.com/400x250/6c63ff/ffffff?text=${encodeURIComponent(course.title)}`;
//                 }}
//               />
//               <div className="course-level">{course.level}</div>
//             </div>
            
//             <div className="course-content">
//               <h3 className="course-title">{course.title}</h3>
//               <p className="course-description">{course.description}</p>
              
//               <div className="course-meta">
//                 <div className="course-stats">
//                   <span>📚 {course.lessons} lessons</span>
//                   <span>⏱️ {course.hours} hours</span>
//                   <span>⭐ {course.rating}</span>
//                 </div>
//                 <div className="course-instructor">
//                   By {course.instructor}
//                 </div>
//               </div>
              
//               <div className="course-footer">
//                 <div className="course-price">
//                   <span className="price">${course.price}</span>
//                 </div>
//                 <button 
//                   className="enroll-btn"
//                   onClick={() => handleEnroll(course.id)}
//                 >
//                   Enroll Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredCourses.length === 0 && (
//         <div className="no-courses">
//           <h3>No courses found</h3>
//           <p>Try adjusting your search or filter criteria</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CourseList;