// // API Service for connecting to JSON Server
// const API_BASE_URL = 'http://localhost:3001';

// export const api = {
//   // Test connection
//   testConnection: async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/courses`);
//       if (response.ok) {
//         console.log('✅ Database connected successfully!');
//         return true;
//       } else {
//         console.log('❌ Database connection failed');
//         return false;
//       }
//     } catch (error) {
//       console.log('❌ Database connection error:', error);
//       return false;
//     }
//   },

//   // Get all courses
//   getCourses: async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/courses`);
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//       return [];
//     }
//   },

//   // Get user data
//   getUser: async (id) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/users/${id}`);
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching user:', error);
//       return null;
//     }
//   }
// };