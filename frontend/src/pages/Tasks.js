// src/pages/Tasks.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Tasks() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  // Загружаем задачи из localStorage или используем демо-данные
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Настроить фронтенд', status: 'done', assignee: 'admin@example.com', deadline: '2025-12-20' },
      { id: 2, title: 'Добавить новости', status: 'not_done', assignee: 'user@example.com', deadline: '2025-12-25' },
    ];
  });

  const [filter, setFilter] = useState('all'); // 'all', 'done', 'not_done'
  const [newTask, setNewTask] = useState({ title: '', description: '', deadline: '', status: 'not_done' });

  // Сохраняем задачи при изменении
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Защита маршрута
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Фильтрация
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  // Создание задачи
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const task = {
      id: Date.now(),
      ...newTask,
      assignee: userRole === 'admin' ? 'admin@example.com' : 'user@example.com'
    };

    setTasks([task, ...tasks]);
    setNewTask({ title: '', description: '', deadline: '', status: 'not_done' });
  };

  // Переключение статуса
  const toggleStatus = (id) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, status: task.status === 'done' ? 'not_done' : 'done' }
        : task
    ));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Задачи</h2>
      <p>Роль: {userRole === 'admin' ? 'Администратор' : 'Сотрудник'}</p>

      {/* Форма создания задачи */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Создать задачу</h3>
        <form onSubmit={handleCreateTask}>
          <input
            type="text"
            placeholder="Название задачи"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <textarea
            placeholder="Описание"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            style={{ width: '100%', padding: '8px', marginBottom: '10px', height: '60px' }}
          />
          <input
            type="date"
            value={newTask.deadline}
            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 15px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Создать задачу
          </button>
        </form>
      </div>

      {/* Фильтры */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{ marginRight: '10px', padding: '5px 10px' }}
        >
          Все
        </button>
        <button
          onClick={() => setFilter('not_done')}
          style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#ffc107' }}
        >
          Не выполнено
        </button>
        <button
          onClick={() => setFilter('done')}
          style={{ padding: '5px 10px', backgroundColor: '#28a745', color: 'white' }}
        >
          Выполнено
        </button>
      </div>

      {/* Список задач */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            style={{
              marginBottom: '15px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: task.status === 'done' ? '#e9ffe9' : '#fff3cd'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0' }}>{task.title}</h4>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.9em' }}>{task.description}</p>
                <p><strong>Дедлайн:</strong> {task.deadline}</p>
                <p><strong>Ответственный:</strong> {task.assignee}</p>
              </div>
              <button
                onClick={() => toggleStatus(task.id)}
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
            </div>
          </li>
        ))}
      </ul>

      {/* Кнопка выхода */}
      <button
        onClick={() => {
          localStorage.clear();
          navigate('/login');
        }}
        style={{ marginTop: '20px', padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Выйти
      </button>
    </div>
  );
}