import React, { useState, useEffect } from 'react';
import './StudentManagement.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enrolledCourses: [],
    completedCourses: [],
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active',
    address: '',
    emergencyContact: '',
  });

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:3001/users');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

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

  const handleCourseSelection = (courseId) => {
    const id = parseInt(courseId);
    setFormData((prev) => {
      const isEnrolled = prev.enrolledCourses.includes(id);
      return {
        ...prev,
        enrolledCourses: isEnrolled
          ? prev.enrolledCourses.filter((c) => c !== id)
          : [...prev.enrolledCourses, id],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentData = {
      ...formData,
      courseProgress: editingStudent?.courseProgress || [],
    };

    try {
      if (editingStudent) {
        await fetch(`http://localhost:3001/users/${editingStudent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData),
        });
        alert('Student updated successfully!');
      } else {
        await fetch('http://localhost:3001/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData),
        });
        alert('Student added successfully!');
      }

      fetchStudents();
      closeModal();
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Error saving student!');
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await fetch(`http://localhost:3001/users/${studentId}`, {
          method: 'DELETE',
        });
        alert('Student deleted successfully!');
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student!');
      }
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone || '',
      enrolledCourses: student.enrolledCourses || [],
      completedCourses: student.completedCourses || [],
      joinDate: student.joinDate,
      status: student.status || 'active',
      address: student.address || '',
      emergencyContact: student.emergencyContact || '',
    });
    setShowModal(true);
  };

  const viewDetails = (student) => {
    setSelectedStudent(student);
    setViewDetailsModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      enrolledCourses: [],
      completedCourses: [],
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      address: '',
      emergencyContact: '',
    });
  };

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="student-management">
      <header className="management-header">
        <div>
          <h1>Student Management</h1>
          <p>Manage student database and enrollments</p>
        </div>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          ➕ Add New Student
        </button>
      </header>

      <div className="filters-section">
        <input
          type="text"
          placeholder="🔍 Search students by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="student-stats">
        <div className="stat-box">
          <span className="stat-number">{students.length}</span>
          <span className="stat-label">Total Students</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">
            {students.filter((s) => s.status === 'active').length}
          </span>
          <span className="stat-label">Active Students</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">
            {students.reduce(
              (acc, s) => acc + (s.enrolledCourses?.length || 0),
              0
            )}
          </span>
          <span className="stat-label">Total Enrollments</span>
        </div>
      </div>

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Enrolled Courses</th>
              <th>Completed</th>
              <th>Join Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>
                  <div className="student-name-cell">
                    <strong>{student.name}</strong>
                  </div>
                </td>
                <td>{student.email}</td>
                <td>{student.enrolledCourses?.length || 0}</td>
                <td>{student.completedCourses?.length || 0}</td>
                <td>{new Date(student.joinDate).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${student.status || 'active'}`}>
                    {student.status || 'active'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => viewDetails(student)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(student)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(student.id)}
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

        {filteredStudents.length === 0 && (
          <div className="no-data">
            <p>No students found.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
              <button className="close-btn" onClick={closeModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="student-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div className="form-group">
                  <label>Join Date *</label>
                  <input
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Emergency Contact</label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Full address..."
                  />
                </div>

                <div className="form-group full-width">
                  <label>Enrolled Courses</label>
                  <div className="course-checkboxes">
                    {courses.map((course) => (
                      <label key={course.id} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.enrolledCourses.includes(course.id)}
                          onChange={() => handleCourseSelection(course.id)}
                        />
                        <span>{course.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewDetailsModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setViewDetailsModal(false)}>
          <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Student Details</h2>
              <button className="close-btn" onClick={() => setViewDetailsModal(false)}>
                ✕
              </button>
            </div>

            <div className="student-details">
              <div className="detail-section">
                <h3>Personal Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Name:</strong> {selectedStudent.name}
                  </div>
                  <div className="detail-item">
                    <strong>Email:</strong> {selectedStudent.email}
                  </div>
                  <div className="detail-item">
                    <strong>Phone:</strong> {selectedStudent.phone || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Join Date:</strong>{' '}
                    {new Date(selectedStudent.joinDate).toLocaleDateString()}
                  </div>
                  <div className="detail-item">
                    <strong>Status:</strong>{' '}
                    <span className={`status-badge ${selectedStudent.status}`}>
                      {selectedStudent.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Enrolled Courses ({selectedStudent.enrolledCourses?.length || 0})</h3>
                <ul className="courses-list">
                  {selectedStudent.enrolledCourses?.map((courseId) => (
                    <li key={courseId}>{getCourseName(courseId)}</li>
                  )) || <li>No courses enrolled</li>}
                </ul>
              </div>

              <div className="detail-section">
                <h3>Completed Courses ({selectedStudent.completedCourses?.length || 0})</h3>
                <ul className="courses-list">
                  {selectedStudent.completedCourses?.map((courseId) => (
                    <li key={courseId}>✓ {getCourseName(courseId)}</li>
                  )) || <li>No courses completed</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;