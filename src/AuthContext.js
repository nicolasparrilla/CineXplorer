import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    const storedUser = localStorage.getItem('authUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:4000/api/users/login', { email, password });
      const user = response.data.loginUser.user;
      const token = response.data.token;

      localStorage.setItem('authUser', JSON.stringify(user));
      localStorage.setItem('authToken', token);

      setAuthState(user);
      console.log('Login successful', response.data);
      console.log('User ID:', user._id);
      console.log('User Email:', user.email);
      console.log('User name:', user.name);
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const response = await axios.post('http://localhost:4000/api/users/registration', {
        name,
        email,
        password
      });

      const user = response.data.createdUser;

      localStorage.setItem('authUser', JSON.stringify(user));

      setAuthState(user);
      console.log('Registration successful', response.data);
      localStorage.removeItem('movieFilters');
      return { status: 200 };
    } catch (error) {
      console.error('Registration failed', error);
      return { status: error.response?.status, message: error.response?.data?.message || 'Error en el registro' };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('movieFilters');
    setAuthState(null);
    window.location.reload();
  };

  const isLoggedIn = !!authState;

  return (
    <AuthContext.Provider value={{ authState, handleRegister, handleLogin, handleLogout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}