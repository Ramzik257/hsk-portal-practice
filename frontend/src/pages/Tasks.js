// src/pages/Tasks.js (обновлённый)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'not_done',
    assignee: ''
  });
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/tasks/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        }
      } catch (err) {
        console.error('Ошибка загрузки задач:', err);
      }
    };
    if (token) fetchTasks();
  }, [token]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.assignee) {
      alert('Выберите исполнителя');
      return;
    }
    try {
      const res = await fetch('http://localhost:8000/api/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTask)
      });
      if (res.ok) {
        const task = await res.json();
        setTasks([task, ...tasks]);
        setNewTask({ title: '', description: '', deadline: '', status: 'not_done', assignee: '' });
      } else {
        const err = await res.json();
        alert('Ошибка: ' + (err.detail || 'Проверьте поля'));
      }
    } catch (err) {
      alert('Ошибка сети');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить задачу?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== id));
      } else {
        alert('Нет прав');
      }
    } catch (err) {
      alert('Ошибка сети');
    }
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'done' ? 'not_done' : 'done';
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${task.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
      }
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  const filteredTasks = tasks.filter(t => filter === 'all' || t.status === filter);

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ color: '#333' }}>Задачи</h2>
      <p>Роль: <strong>{userRole === 'admin' ? 'Администратор' : 'Сотрудник'}</strong></p>

      <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #e9ecef' }}>
        <h3 style={{ margin: '0 0 12px 0' }}>Создать задачу</h3>
        <form onSubmit={handleCreateTask}>
          <input
            type="text"
            placeholder="Название задачи"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'  // ← Исправлено!
            }}
          />
          <textarea
            placeholder="Описание"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              height: '60px',
              boxSizing: 'border-box'  // ← Исправлено!
            }}
          />
          <input
            type="date"
            value={newTask.deadline}
            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'  // ← Исправлено!
            }}
          />
          <select
            value={newTask.assignee}
            onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'  // ← Исправлено!
            }}
          >
            <option value="">Выберите исполнителя</option>
            <option value="admin@example.com">Администратор</option>
            <option value="user@example.com">Сотрудник</option>
          </select>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              boxSizing: 'border-box'  // ← Исправлено!
            }}
          >
            Создать задачу
          </button>
        </form>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            marginRight: '8px',
            padding: '6px 12px',
            backgroundColor: filter === 'all' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Все
        </button>
        <button
          onClick={() => setFilter('not_done')}
          style={{
            marginRight: '8px',
            padding: '6px 12px',
            backgroundColor: filter === 'not_done' ? '#ffc107' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Не выполнено
        </button>
        <button
          onClick={() => setFilter('done')}
          style={{
            padding: '6px 12px',
            backgroundColor: filter === 'done' ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Выполнено
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredTasks.map(task => (
          <div
            key={task.id}
            style={{
              padding: '16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: task.status === 'done' ? '#d4edda' : '#fff3cd'
            }}
          >
            <h4 style={{ margin: '0 0 8px 0', color: '#222' }}>{task.title}</h4>
            <p style={{ margin: '0 0 12px 0', color: '#555' }}>{task.description || 'Без описания'}</p>
            <p><strong>Дедлайн:</strong> {task.deadline}</p>
            <p><strong>Ответственный:</strong> {task.assignee}</p>
            <p><strong>Постановщик:</strong> {task.assigner}</p>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => toggleStatus(task)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: task.status === 'done' ? '#ffc107' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {task.status === 'done' ? 'Отменить' : 'Выполнено'}
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
        {filteredTasks.length === 0 && <p>Нет задач</p>}
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