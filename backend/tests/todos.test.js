const request = require('supertest');
const app     = require('../src/index');

// Mock mongoose so tests don't need a real DB
jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');
  return {
    ...actual,
    connect: jest.fn().mockResolvedValue(true),
  };
});

// Mock the Todo model
jest.mock('../src/models/Todo', () => ({
  find:            jest.fn(),
  create:          jest.fn(),
  findById:        jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

const Todo = require('../src/models/Todo');

describe('GET /health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/todos', () => {
  it('returns list of todos', async () => {
    const mockTodos = [{ _id: '1', title: 'Test todo', completed: false }];
    Todo.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(mockTodos) });

    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockTodos);
  });
});

describe('POST /api/todos', () => {
  it('creates a todo successfully', async () => {
    const newTodo = { _id: '2', title: 'New task', completed: false };
    Todo.create.mockResolvedValue(newTodo);

    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'New task' });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('New task');
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Title is required');
  });
});

describe('DELETE /api/todos/:id', () => {
  it('deletes a todo successfully', async () => {
    Todo.findByIdAndDelete.mockResolvedValue({ _id: '1', title: 'Test' });

    const res = await request(app).delete('/api/todos/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Deleted successfully');
  });

  it('returns 404 when todo not found', async () => {
    Todo.findByIdAndDelete.mockResolvedValue(null);

    const res = await request(app).delete('/api/todos/999');
    expect(res.statusCode).toBe(404);
  });
});
