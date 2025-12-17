// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import News from './pages/News';
import AdminUsers from './pages/AdminUsers';

function Navigation() {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  // Не показываем панель на страницах входа и регистрации
  if (!isAuthenticated || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login'; // Полный редирект, чтобы сбросить состояние
  };

  return (
    <nav style={{
      backgroundColor: '#333',
      padding: '10px',
      marginBottom: '20px'
    }}>
      <Link to="/tasks" style={navLinkStyle}>Задачи</Link>
      <Link to="/news" style={navLinkStyle}>Новости</Link>
      
      {userRole === 'admin' && (
        <Link to="/admin/users" style={navLinkStyle}>Пользователи</Link>
      )}
      
      <button
        onClick={handleLogout}
        style={{
          ...navLinkStyle,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginLeft: '15px',
          color: '#ff4d4d'
        }}
      >
        Выйти
      </button>
    </nav>
  );
}

const navLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  margin: '0 15px',
  padding: '5px 10px',
  borderRadius: '4px',
  backgroundColor: '#555',
};

export default function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/news" element={<News />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}