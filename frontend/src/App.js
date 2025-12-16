// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import News from './pages/News';

function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Router>
      {isAuthenticated && (
        <nav style={{
          backgroundColor: '#333',
          padding: '10px',
          marginBottom: '20px'
        }}>
          <Link to="/tasks" style={navLinkStyle}>Задачи</Link>
          <Link to="/news" style={navLinkStyle}>Новости</Link>
          <Link to="/login" onClick={() => localStorage.clear()} style={navLinkStyle}>Выйти</Link>
        </nav>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/news" element={<News />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
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

export default App;