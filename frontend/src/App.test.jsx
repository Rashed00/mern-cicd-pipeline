import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App.jsx';

// Mock fetch globally
const mockTodos = [
  { _id: '1', title: 'Buy groceries', completed: false },
  { _id: '2', title: 'Walk the dog',  completed: true  },
];

beforeEach(() => {
  global.fetch = vi.fn();
});

describe('App', () => {
  it('renders the heading', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => mockTodos,
    });

    render(<App />);
    expect(screen.getByText('Todo App')).toBeInTheDocument();
  });

  it('renders fetched todos', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => mockTodos,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.getByText('Walk the dog')).toBeInTheDocument();
    });
  });

  it('adds a new todo', async () => {
    const newTodo = { _id: '3', title: 'New task', completed: false };

    global.fetch
      .mockResolvedValueOnce({ json: async () => [] })         // initial fetch
      .mockResolvedValueOnce({ json: async () => newTodo });   // POST

    render(<App />);

    const input  = screen.getByPlaceholderText('Add a new task...');
    const button = screen.getByRole('button', { name: 'Add' });

    fireEvent.change(input, { target: { value: 'New task' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('New task')).toBeInTheDocument();
    });
  });

  it('shows empty state when no todos', async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => [] });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
    });
  });
});
