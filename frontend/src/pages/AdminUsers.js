// src/pages/AdminUsers.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'employee' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Проверка прав админа
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      navigate('/tasks');
    }
  }, [navigate]);

  // Загрузка списка пользователей
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('http://localhost:8000/api/users/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        } else {
          setError('Не удалось загрузить пользователей');
        }
      } catch (err) {
        setError('Ошибка подключения к серверу');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Создание нового пользователя
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:8000/api/users/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        const user = await res.json();
        setUsers([user, ...users]);
        setNewUser({ email: '', password: '', role: 'employee' });
        alert('Пользователь создан');
      } else {
        const err = await res.json();
        alert(err.error || 'Ошибка создания');
      }
    } catch (err) {
      alert('Не удалось создать пользователя');
    }
  };

  // Изменение роли
  const handleToggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'employee' : 'admin';
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`http://localhost:8000/api/users/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
      } else {
        alert('Не удалось изменить роль');
      }
    } catch (err) {
      alert('Ошибка сети');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Управление пользователями</h2>
      
      {/* Форма создания */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Добавить пользователя</h3>
        <form onSubmit={handleCreateUser}>
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
            style={{ width: '100%', padding: '6px', marginBottom: '10px' }}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
            style={{ width: '100%', padding: '6px', marginBottom: '10px' }}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            style={{ width: '100%', padding: '6px', marginBottom: '10px' }}
          >
            <option value="employee">Сотрудник</option>
            <option value="admin">Администратор</option>
          </select>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Создать
          </button>
        </form>
      </div>

      {/* Таблица пользователей */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#343a40', color: 'white' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Роль</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{user.email}</td>
              <td style={{ padding: '10px' }}>
                {user.role === 'admin' ? 'Администратор' : 'Сотрудник'}
              </td>
              <td style={{ padding: '10px' }}>
                <button
                  onClick={() => handleToggleRole(user.id, user.role)}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: user.role === 'admin' ? '#ffc107' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {user.role === 'admin' ? 'Сделать сотрудником' : 'Сделать админом'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Кнопка выхода */}
      <button
        onClick={() => {
          localStorage.clear();
          navigate('/login');
        }}
        style={{ 
          marginTop: '20px', 
          padding: '8px 16px', 
          backgroundColor: '#dc3545', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px' 
        }}
      >
        Выйти
      </button>
    </div>
  );
}