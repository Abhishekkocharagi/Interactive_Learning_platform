import React, { createContext, useState, useContext, useEffect } from 'react';
import { getFromStorage, setToStorage, removeFromStorage } from '../../utils/localStorage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = getFromStorage('user');
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call - In real app, this would be an API request
      const users = getFromStorage('users') || [];
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const userWithoutPassword = { ...foundUser };
        delete userWithoutPassword.password;
        
        setUser(userWithoutPassword);
        setToStorage('user', userWithoutPassword);
        return { success: true };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const users = getFromStorage('users') || [];
      
      // Check if user already exists
      if (users.find(u => u.email === userData.email)) {
        return { success: false, message: 'User already exists' };
      }

      const newUser = {
        id: Date.now(),
        ...userData,
        created_at: new Date().toISOString()
      };

      users.push(newUser);
      setToStorage('users', users);

      const userWithoutPassword = { ...newUser };
      delete userWithoutPassword.password;
      
      setUser(userWithoutPassword);
      setToStorage('user', userWithoutPassword);
      
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    removeFromStorage('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};