import { useState, useEffect } from 'react';

const API = '/api/todos';

export default function App() {
  const [todos,   setTodos]   = useState([]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => { fetchTodos(); }, []);

  async function fetchTodos() {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setTodos(data);
    } catch {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(e) {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input.trim() }),
      });
      const todo = await res.json();
      setTodos([todo, ...todos]);
      setInput('');
    } catch {
      setError('Failed to add todo.');
    }
  }

  async function toggleTodo(id) {
    try {
      const res = await fetch(`${API}/${id}`, { method: 'PATCH' });
      const updated = await res.json();
      setTodos(todos.map(t => (t._id === id ? updated : t)));
    } catch {
      setError('Failed to update todo.');
    }
  }

  async function deleteTodo(id) {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      setTodos(todos.filter(t => t._id !== id));
    } catch {
      setError('Failed to delete todo.');
    }
  }

  return (
    <div className="container">
      <h1>Todo App</h1>

      <form onSubmit={addTodo} className="add-form">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a new task..."
          aria-label="New todo"
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="loading">Loading...</p>
      ) : todos.length === 0 ? (
        <p className="empty">No tasks yet. Add one above!</p>
      ) : (
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo._id} className={todo.completed ? 'done' : ''}>
              <span onClick={() => toggleTodo(todo._id)}>{todo.title}</span>
              <button
                onClick={() => deleteTodo(todo._id)}
                aria-label="Delete todo"
                className="delete-btn"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
