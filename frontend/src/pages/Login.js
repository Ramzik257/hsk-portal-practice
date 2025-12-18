// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('accessToken', data.access);
        navigate('/tasks');
      } else {
        setError(data.error || 'Неверный email или пароль');
      }
    } catch (err) {
      setError('Не удалось подключиться к серверу');
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '60px auto', padding: '30px', fontFamily: 'Segoe UI, sans-serif', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '24px' }}>Вход в систему</h2>
      {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '16px',
              boxSizing: 'border-box'  // ← Исправлено!
            }}
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '16px',
              boxSizing: 'border-box'  // ← Исправлено!
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            boxSizing: 'border-box'  // ← Исправлено!
          }}
        >
          Войти
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Нет аккаунта?{' '}
        <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}