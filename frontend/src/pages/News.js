// src/pages/News.js (обновлённый)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function News() {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [newNews, setNewNews] = useState({ title: '', content: '' });
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const fetchNews = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/news/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNewsList(data);
        }
      } catch (err) {
        console.error('Ошибка загрузки новостей:', err);
      }
    };
    fetchNews();
  }, [isAuthenticated, navigate, token]);

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/news/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newNews)
      });
      if (res.ok) {
        const item = await res.json();
        setNewsList([item, ...newsList]);
        setNewNews({ title: '', content: '' });
      }
    } catch (err) {
      alert('Не удалось опубликовать новость');
    }
  };

  const handleDelete = async (id) => {
    if (userRole !== 'admin') {
      alert('Только администратор может удалять новости!');
      return;
    }
    if (!window.confirm('Удалить новость?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/news/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setNewsList(newsList.filter(n => n.id !== id));
      }
    } catch (err) {
      alert('Ошибка удаления');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ color: '#333' }}>Лента новостей</h2>
      <p>Роль: <strong>{userRole === 'admin' ? 'Администратор' : 'Сотрудник'}</strong></p>

      <div style={{ backgroundColor: '#f0f8ff', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #cce7ff' }}>
        <h3 style={{ margin: '0 0 12px 0' }}>Опубликовать новость</h3>
        <form onSubmit={handlePublish}>
          <input
            type="text"
            placeholder="Заголовок"
            value={newNews.title}
            onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
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
            placeholder="Содержание новости"
            value={newNews.content}
            onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              height: '80px',
              boxSizing: 'border-box'  // ← Исправлено!
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              boxSizing: 'border-box'  // ← Исправлено!
            }}
          >
            Опубликовать
          </button>
        </form>
      </div>

      <h3 style={{ marginTop: '32px', marginBottom: '16px', color: '#333' }}>Лента новостей</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {newsList.map(item => (
          <div
            key={item.id}
            style={{
              padding: '16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#fafafa'
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', color: '#222' }}>{item.title}</h3>
            <p style={{ margin: '0 0 12px 0', color: '#555' }}>{item.content}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <small style={{ color: '#777' }}>Автор: {item.author_email}</small> {/* ← Исправлено! */}
              {userRole === 'admin' && (
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Удалить
                </button>
              )}
            </div>
          </div>
        ))}
        {newsList.length === 0 && <p>Нет новостей</p>}
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