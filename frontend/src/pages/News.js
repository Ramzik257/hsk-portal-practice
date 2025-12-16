// src/pages/News.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function News() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  // Загружаем новости из localStorage или демо-данные
  const [newsList, setNewsList] = useState(() => {
    const saved = localStorage.getItem('news');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Добро пожаловать!', content: 'Портал успешно запущен.', author: 'admin@example.com' },
      { id: 2, title: 'Обновление задач', content: 'Добавлена фильтрация по статусу.', author: 'admin@example.com' },
    ];
  });

  const [newNews, setNewNews] = useState({ title: '', content: '' });

  useEffect(() => {
    localStorage.setItem('news', JSON.stringify(newsList));
  }, [newsList]);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handlePublish = (e) => {
    e.preventDefault();
    if (!newNews.title.trim() || !newNews.content.trim()) return;

    const newsItem = {
      id: Date.now(),
      ...newNews,
      author: userRole === 'admin' 
        ? 'admin@example.com' 
        : 'user@example.com'
    };

    setNewsList([newsItem, ...newsList]);
    setNewNews({ title: '', content: '' });
  };

  const handleDelete = (id) => {
    if (userRole !== 'admin') {
      alert('Только администратор может удалять новости!');
      return;
    }
    if (window.confirm('Удалить новость?')) {
      setNewsList(newsList.filter(item => item.id !== id));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Лента новостей</h2>

      {/* Форма публикации */}
      <div style={{ backgroundColor: '#f0f8ff', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Опубликовать новость</h3>
        <form onSubmit={handlePublish}>
          <input
            type="text"
            placeholder="Заголовок"
            value={newNews.title}
            onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <textarea
            placeholder="Текст новости"
            value={newNews.content}
            onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px', height: '80px' }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 15px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Опубликовать
          </button>
        </form>
      </div>

      {/* Список новостей */}
      <div>
        {newsList.map((item) => (
          <div 
            key={item.id} 
            style={{ 
              marginBottom: '20px', 
              padding: '15px', 
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: '#fafafa',
              position: 'relative'
            }}
          >
            <h3>{item.title}</h3>
            <p>{item.content}</p>
            <small>Автор: {item.author}</small>
            
            {/* Кнопка удаления — только для админа */}
            {userRole === 'admin' && (
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  cursor: 'pointer'
                }}
              >
                Удалить
              </button>
            )}
          </div>
        ))}
      </div>

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