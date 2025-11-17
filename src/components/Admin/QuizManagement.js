import React, { useState, useEffect } from 'react';
import './QuizManagement.css';

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    week: 1,
    duration: 30,
    passingScore: 70,
    questions: [],
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 10,
  });

  useEffect(() => {
    fetchQuizzes();
    fetchCourses();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('http://localhost:3001/quizzes');
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
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

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (index, value) => {
    setCurrentQuestion((prev) => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return { ...prev, options: newOptions };
    });
  };

  const addQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some((opt) => !opt)) {
      alert('Please fill in all question fields!');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, { ...currentQuestion, id: Date.now() }],
    }));
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 10,
    });
  };

  const removeQuestion = (questionId) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.questions.length === 0) {
      alert('Please add at least one question!');
      return;
    }
    const quizData = {
      ...formData,
      courseId: parseInt(formData.courseId),
      week: parseInt(formData.week),
      duration: parseInt(formData.duration),
      passingScore: parseInt(formData.passingScore),
      totalPoints: formData.questions.reduce((sum, q) => sum + q.points, 0),
      createdAt: editingQuiz?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      if (editingQuiz) {
        await fetch(`http://localhost:3001/quizzes/${editingQuiz.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quizData),
        });
        alert('Quiz updated successfully!');
      } else {
        await fetch('http://localhost:3001/quizzes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quizData),
        });
        alert('Quiz created successfully!');
      }
      fetchQuizzes();
      closeModal();
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Error saving quiz!');
    }
  };

  const handleDelete = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await fetch(`http://localhost:3001/quizzes/${quizId}`, {
          method: 'DELETE',
        });
        alert('Quiz deleted successfully!');
        fetchQuizzes();
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Error deleting quiz!');
      }
    }
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      courseId: quiz.courseId,
      week: quiz.week,
      duration: quiz.duration,
      passingScore: quiz.passingScore,
      questions: quiz.questions,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingQuiz(null);
    setFormData({
      title: '',
      courseId: '',
      week: 1,
      duration: 30,
      passingScore: 70,
      questions: [],
    });
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 10,
    });
  };

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  return (
    <div className="quiz-management">
      <header className="management-header">
        <div>
          <h1>Quiz Management</h1>
          <p>Create and manage quizzes for your courses</p>
        </div>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          ➕ Create New Quiz
        </button>
      </header>

      <div className="quizzes-grid">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="quiz-card">
            <div className="quiz-header">
              <h3>{quiz.title}</h3>
              <span className="quiz-course">{getCourseName(quiz.courseId)}</span>
            </div>
            <div className="quiz-details">
              <div className="quiz-detail-item">
                <span className="label">Week:</span>
                <span className="value">{quiz.week}</span>
              </div>
              <div className="quiz-detail-item">
                <span className="label">Questions:</span>
                <span className="value">{quiz.questions?.length || 0}</span>
              </div>
              <div className="quiz-detail-item">
                <span className="label">Duration:</span>
                <span className="value">{quiz.duration} mins</span>
              </div>
              <div className="quiz-detail-item">
                <span className="label">Passing Score:</span>
                <span className="value">{quiz.passingScore}%</span>
              </div>
              <div className="quiz-detail-item">
                <span className="label">Total Points:</span>
                <span className="value">{quiz.totalPoints}</span>
              </div>
            </div>
            <div className="quiz-actions">
              <button className="edit-btn" onClick={() => handleEdit(quiz)}>
                ✏️ Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(quiz.id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}

        {quizzes.length === 0 && (
          <div className="no-data">
            <p>No quizzes created yet. Create your first quiz!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content quiz-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</h2>
              <button className="close-btn" onClick={closeModal}>
                ✕
              </button>
            </div>
            {/* All form elements must be inside <form> */}
            <form onSubmit={handleSubmit} className="quiz-form">
              <div className="form-section">
                <h3>Quiz Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Quiz Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Week 1 Quiz"
                    />
                  </div>
                  <div className="form-group">
                    <label>Course *</label>
                    <select
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Week Number *</label>
                    <input
                      type="number"
                      name="week"
                      value={formData.week}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration (minutes) *</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      min="5"
                    />
                  </div>
                  <div className="form-group">
                    <label>Passing Score (%) *</label>
                    <input
                      type="number"
                      name="passingScore"
                      value={formData.passingScore}
                      onChange={handleInputChange}
                      required
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>
              <div className="form-section">
                <h3>Add Question</h3>
                <div className="question-builder">
                  <div className="form-group full-width">
                    <label>Question *</label>
                    <textarea
                      name="question"
                      value={currentQuestion.question}
                      onChange={handleQuestionChange}
                      rows="2"
                      placeholder="Enter your question..."
                    />
                  </div>
                  <div className="options-grid">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="option-group">
                        <label>
                          <input
                            type="radio"
                            checked={currentQuestion.correctAnswer === index}
                            onChange={() =>
                              setCurrentQuestion((prev) => ({
                                ...prev,
                                correctAnswer: index,
                              }))
                            }
                          />
                          Option {index + 1}
                        </label>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                          placeholder={`Option ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="form-group">
                    <label>Points</label>
                    <input
                      type="number"
                      name="points"
                      value={currentQuestion.points}
                      onChange={handleQuestionChange}
                      min="1"
                    />
                  </div>
                  <button
                    type="button"
                    className="add-question-btn"
                    onClick={addQuestion}
                  >
                    ➕ Add Question
                  </button>
                </div>
              </div>
              {formData.questions.length > 0 && (
                <div className="form-section">
                  <h3>Questions ({formData.questions.length})</h3>
                  <div className="questions-list">
                    {formData.questions.map((q, index) => (
                      <div key={q.id} className="question-item">
                        <div className="question-header">
                          <strong>Q{index + 1}:</strong> {q.question}
                          <button
                            type="button"
                            className="remove-question-btn"
                            onClick={() => removeQuestion(q.id)}
                          >
                            ✕
                          </button>
                        </div>
                        <div className="question-options">
                          {q.options.map((opt, i) => (
                            <div
                              key={i}
                              className={`option ${
                                i === q.correctAnswer ? 'correct' : ''
                              }`}
                            >
                              {i === q.correctAnswer && '✓ '}
                              {opt}
                            </div>
                          ))}
                        </div>
                        <div className="question-meta">
                          Points: {q.points}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Wrap form actions as part of the form */}
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
                </button>
              </div>
            </form>
            {/* End of form */}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;
