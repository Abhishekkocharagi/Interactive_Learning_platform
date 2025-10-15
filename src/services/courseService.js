import { getFromStorage, setToStorage } from '../utils/localStorage';

// Sample course data
const sampleCourses = [
  {
    id: 1,
    title: 'JavaScript Fundamentals',
    description: 'Learn JavaScript from basics to advanced concepts',
    difficulty_level: 'Beginner',
    duration_hours: 20,
    total_lessons: 12,
    image_url: 'https://via.placeholder.com/300x200/007bff/white?text=JavaScript'
  },
  {
    id: 2,
    title: 'React.js Development',
    description: 'Build modern web applications with React',
    difficulty_level: 'Intermediate',
    duration_hours: 30,
    total_lessons: 15,
    image_url: 'https://via.placeholder.com/300x200/61dafb/white?text=React.js'
  },
  {
    id: 3,
    title: 'Full Stack Web Development',
    description: 'Complete web development with MERN stack',
    difficulty_level: 'Advanced',
    duration_hours: 50,
    total_lessons: 25,
    image_url: 'https://via.placeholder.com/300x200/28a745/white?text=Full+Stack'
  }
];

const sampleLessons = {
  1: [
    { id: 1, title: 'Introduction to JavaScript', content: 'Welcome to JavaScript!', code_example: 'console.log("Hello World!");' },
    { id: 2, title: 'Variables and Data Types', content: 'Learn about variables', code_example: 'let name = "JavaScript";' },
  ],
  2: [
    { id: 3, title: 'Introduction to React', content: 'Welcome to React!', code_example: 'const App = () => <h1>Hello React!</h1>;' },
    { id: 4, title: 'Components and Props', content: 'Learn about components', code_example: 'const Welcome = ({name}) => <h1>Hello {name}</h1>;' },
  ],
  3: [
    { id: 5, title: 'Full Stack Overview', content: 'Welcome to Full Stack!', code_example: 'const server = require("express")();' },
  ]
};

export const getCourses = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Initialize sample data if not exists
  const existingCourses = getFromStorage('courses');
  if (!existingCourses) {
    setToStorage('courses', sampleCourses);
    setToStorage('lessons', sampleLessons);
    return sampleCourses;
  }
  
  return existingCourses;
};

export const getCourseDetail = async (courseId) => {
  const courses = getFromStorage('courses') || sampleCourses;
  const lessons = getFromStorage('lessons') || sampleLessons;
  
  const course = courses.find(c => c.id === parseInt(courseId));
  const courseLessons = lessons[courseId] || [];
  
  return {
    course,
    lessons: courseLessons,
    enrolled: true // For demo purposes, assume all users are enrolled
  };
};

export const getLessonContent = async (courseId, lessonId) => {
  const lessons = getFromStorage('lessons') || sampleLessons;
  const courseLessons = lessons[courseId] || [];
  
  const lesson = courseLessons.find(l => l.id === parseInt(lessonId));
  
  if (lesson) {
    // Add quiz questions for demo
    lesson.quiz_questions = [
      {
        question: 'What did you learn in this lesson?',
        options: ['Variables', 'Functions', 'Objects', 'All of the above'],
        correct_answer: 'All of the above'
      }
    ];
  }
  
  return lesson;
};

export const getUserProgress = async (userId) => {
  const progress = getFromStorage(`progress_${userId}`) || {};
  return progress;
};

export const markLessonComplete = async (userId, courseId, lessonId, score = 100) => {
  const progressKey = `progress_${userId}`;
  const progress = getFromStorage(progressKey) || {};
  
  if (!progress[courseId]) {
    progress[courseId] = {
      completed_lessons: 0,
      total_lessons: 12 // Default value
    };
  }
  
  progress[courseId].completed_lessons += 1;
  progress[courseId][`lesson_${lessonId}`] = {
    completed: true,
    score: score,
    completed_at: new Date().toISOString()
  };
  
  setToStorage(progressKey, progress);
};

export const enrollInCourse = async (userId, courseId) => {
  // For demo purposes, just mark as enrolled
  const enrollments = getFromStorage('enrollments') || {};
  if (!enrollments[userId]) {
    enrollments[userId] = [];
  }
  
  if (!enrollments[userId].includes(parseInt(courseId))) {
    enrollments[userId].push(parseInt(courseId));
    setToStorage('enrollments', enrollments);
  }
};