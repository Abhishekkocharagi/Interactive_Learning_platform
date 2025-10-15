import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import CodePlayground from './CodePlayground';
import { getLessonContent, markLessonComplete } from '../../services/courseService';
import './LessonViewer.css';

const LessonViewer = () => {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    loadLesson();
  }, [courseId, lessonId]);

  const loadLesson = async () => {
    try {
      const lessonData = await getLessonContent(courseId, lessonId);
      setLesson(lessonData);
    } catch (error) {
      console.error('Failed to load lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAnswer = (questionIndex, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const submitQuiz = () => {
    let correct = 0;
    lesson.quiz_questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correct_answer) {
        correct++;
      }
    });

    const score = Math.round((correct / lesson.quiz_questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    // Mark lesson as complete if quiz passed
    if (score >= 70) {
      markLessonComplete(user.id, courseId, lessonId, score);
    }
  };

  const renderQuiz = () => {
    if (!lesson.quiz_questions || lesson.quiz_questions.length === 0) {
      return null;
    }

    return (
      <div className="quiz-section">
        <h3>📝 Quiz Time!</h3>
        {lesson.quiz_questions.map((question, index) => (
          <div key={index} className="quiz-question">
            <h4>{question.question}</h4>
            <div className="quiz-options">
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} className="quiz-option">
                  <input
                    type="radio"
                    name={`question_${index}`}
                    value={option}
                    onChange={() => handleQuizAnswer(index, option)}
                    disabled={quizSubmitted}
                  />
                  <span className={
                    quizSubmitted 
                      ? option === question.correct_answer 
                        ? 'correct' 
                        : option === quizAnswers[index] 
                          ? 'incorrect' 
                          : ''
                      : ''
                  }>
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
        
        {!quizSubmitted && (
          <button 
            onClick={submitQuiz}
            className="btn-primary"
            disabled={Object.keys(quizAnswers).length < lesson.quiz_questions.length}
          >
            Submit Quiz
          </button>
        )}
        
        {quizSubmitted && (
          <div className={`quiz-result ${quizScore >= 70 ? 'passed' : 'failed'}`}>
            <h4>Quiz Results: {quizScore}%</h4>
            <p>
              {quizScore >= 70 
                ? '🎉 Congratulations! You passed the quiz!' 
                : '📚 Keep studying! You need 70% to pass.'}
            </p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading lesson...</div>;
  }

  if (!lesson) {
    return <div className="error">Lesson not found</div>;
  }

  return (
    <div className="lesson-viewer">
      <div className="lesson-header">
        <Link to={`/course/${courseId}`} className="back-link">
          ← Back to Course
        </Link>
        <h1>{lesson.title}</h1>
      </div>

      <div className="lesson-content">
        <div className="lesson-text">
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </div>

        {lesson.code_example && (
          <div className="code-section">
            <h3>💻 Code Example</h3>
            <CodePlayground 
              initialCode={lesson.code_example}
              language="javascript"
            />
          </div>
        )}

        {renderQuiz()}

        <div className="lesson-navigation">
          {lesson.previous_lesson && (
            <Link 
              to={`/lesson/${courseId}/${lesson.previous_lesson}`}
              className="btn-secondary"
            >
              Previous Lesson
            </Link>
          )}
          {lesson.next_lesson && (
            <Link 
              to={`/lesson/${courseId}/${lesson.next_lesson}`}
              className="btn-primary"
            >
              Next Lesson
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;