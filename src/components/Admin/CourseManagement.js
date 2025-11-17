import React, { useState, useEffect } from 'react';
import './CourseManagement.css';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    duration: '',
    instructor: '',
    price: '',
    image: '',
    lessons: 0,
    hours: 0,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:3001/courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const courseData = {
      ...formData,
      rating: editingCourse ? editingCourse.rating : 4.5,
      studentsEnrolled: editingCourse ? editingCourse.studentsEnrolled : 0,
      lessons: parseInt(formData.lessons) || 0,
      hours: parseInt(formData.hours) || 0,
      price: parseFloat(formData.price) || 0,
      syllabus: editingCourse?.syllabus || [],
      materials: editingCourse?.materials || [],
      readings: editingCourse?.readings || [],
      prerequisites: editingCourse?.prerequisites || [],
      learningOutcomes: editingCourse?.learningOutcomes || [],
    };

    try {
      if (editingCourse) {
        await fetch(`http://localhost:3001/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseData),
        });
        alert('Course updated successfully!');
      } else {
        await fetch('http://localhost:3001/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseData),
        });
        alert('Course created successfully!');
      }

      fetchCourses();
      closeModal();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course!');
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await fetch(`http://localhost:3001/courses/${courseId}`, {
          method: 'DELETE',
        });
        alert('Course deleted successfully!');
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course!');
      }
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      duration: course.duration,
      instructor: course.instructor,
      price: course.price,
      image: course.image,
      lessons: course.lessons,
      hours: course.hours,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      level: 'Beginner',
      duration: '',
      instructor: '',
      price: '',
      image: '',
      lessons: 0,
      hours: 0,
    });
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="course-management">
      <header className="management-header">
        <div>
          <h1>Course Management</h1>
          <p>Manage all courses on your platform</p>
        </div>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          ➕ Add New Course
        </button>
      </header>

      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="courses-table-container">
        <table className="courses-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Course Title</th>
              <th>Category</th>
              <th>Level</th>
              <th>Price</th>
              <th>Students</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>
                  <div className="course-title-cell">
                    <strong>{course.title}</strong>
                    <small>{course.instructor}</small>
                  </div>
                </td>
                <td>
                  <span className="category-badge">{course.category}</span>
                </td>
                <td>
                  <span className={`level-badge ${course.level.toLowerCase()}`}>
                    {course.level}
                  </span>
                </td>
                <td>${course.price}</td>
                <td>{course.studentsEnrolled}</td>
                <td>⭐ {course.rating}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(course)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(course.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCourses.length === 0 && (
          <div className="no-data">
            <p>No courses found.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
              <button className="close-btn" onClick={closeModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="course-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Course Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., JavaScript Fundamentals"
                  />
                </div>

                <div className="form-group">
                  <label>Instructor *</label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., John Doe"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="Brief description of the course..."
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Programming"
                  />
                </div>

                <div className="form-group">
                  <label>Level *</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 6 weeks"
                  />
                </div>

                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    placeholder="49.99"
                  />
                </div>

                <div className="form-group">
                  <label>Total Lessons</label>
                  <input
                    type="number"
                    name="lessons"
                    value={formData.lessons}
                    onChange={handleInputChange}
                    placeholder="12"
                  />
                </div>

                <div className="form-group">
                  <label>Total Hours</label>
                  <input
                    type="number"
                    name="hours"
                    value={formData.hours}
                    onChange={handleInputChange}
                    placeholder="20"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;