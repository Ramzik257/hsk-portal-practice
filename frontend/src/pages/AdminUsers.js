// src/pages/AdminUsers.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'employee' });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('accessToken');

  // Проверка прав админа
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      navigate('/tasks');
    }
  }, [navigate]);

  // Загрузка пользователей
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/users/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error('Ошибка:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
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
        alert(err.error || 'Ошибка');
      }
    } catch (err) {
      alert('Ошибка сети');
    }
  };

  const handleToggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'employee' : 'admin';
    try {
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
      }
    } catch (err) {
      alert('Ошибка');
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ color: '#333' }}>Управление пользователями</h2>

      {/* Форма создания */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #e9ecef' }}>
        <h3 style={{ margin: '0 0 12px 0' }}>Добавить пользователя</h3>
        <form onSubmit={handleCreateUser}>
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="employee">Сотрудник</option>
            <option value="admin">Администратор</option>
          </select>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#17a745',
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

      {/* Таблица */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ backgroundColor: '#343a40', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Роль</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px' }}>{user.email}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: user.role === 'admin' ? '#e9ecef' : '#d1ecf1',
                    color: user.role === 'admin' ? '#495057' : '#0c5460'
                  }}>
                    {user.role === 'admin' ? 'Админ' : 'Сотрудник'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
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
                    {user.role === 'admin' ? '→ Сотрудник' : '→ Админ'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          navigate('/login');
        }}
        style={{
          marginTop: '24px',
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Выйти
      </button>
    </div>
  );
}