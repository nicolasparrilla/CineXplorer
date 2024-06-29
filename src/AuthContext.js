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
      const user = response.data.loginUser.user; // Extraer el objeto del usuario
      const token = response.data.token;

      localStorage.setItem('authUser', JSON.stringify(user));
      localStorage.setItem('authToken', token);

      setAuthState(user); // Guardar solo el objeto de usuario en el estado
      console.log('Login successful', response.data);
      console.log('User ID:', user._id); // Imprimir el ID del usuario
      console.log('User Email:', user.email); // Imprimir el correo electrónico del usuario
      console.log('User name:', user.name); // Imprimir el nombre del usuario
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

      const user = response.data.createdUser; // Extraer el objeto del usuario creado

      localStorage.setItem('authUser', JSON.stringify(user));

      setAuthState(user); // Guardar solo el objeto de usuario en el estado
      console.log('Registration successful', response.data);
      console.log('User ID:', user._id); // Imprimir el ID del usuario
      console.log('User Email:', user.email); // Imprimir el correo electrónico del usuario
      console.log('User name:', user.name); // Imprimir el nombre del usuario
      localStorage.removeItem('movieFilters');
      return { status: 200 };
    } catch (error) {
      console.error('Registration failed', error);
      return { status: error.response?.status, message: error.response?.data?.message || 'Error en el registro' };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authUser'); // Limpiar el usuario autenticado del localStorage
    localStorage.removeItem('movieFilters');
    setAuthState(null); // Establecer el estado de autenticación como null
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
