import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';
import './TasksPage.css';

const TasksPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending'
  });
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!user) {
          setIsLoading(false);
          return;
        }
        
        const endpoint = user.role === 'admin' ? '/tasks' : '/tasks/my';
        const response = await api.get(endpoint);
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        toast.error('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    try {
      const response = await api.post('/tasks', newTask);
      setTasks(prev => [...prev, response.data]);
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        status: 'pending'
      });
      toast.success('Task added successfully!');
    } catch (error) {
      console.error('Failed to add task:', error);
      toast.error(error.response?.data?.message || 'Failed to add task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      setTasks(prev =>
        prev.map(task =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      toast.info('Task status updated');
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(task => task._id !== taskId));
      toast.info('Task deleted');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'all') return true;
      return task.status === filter;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  if (authLoading || isLoading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="tasks-container">
      <h1>{user?.role === 'admin' ? 'All Tasks' : 'My Tasks'}</h1>
      {user && (
        <div className="user-info">
          <h2>Welcome, {user.name}</h2>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}

      {user ? (
        <>
          <form onSubmit={handleAddTask} className="task-form">
            <div className="form-group">
              <input
                type="text"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                placeholder="Task title*"
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                placeholder="Description (optional)"
                rows="3"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Due Date:</label>
                <input
                  type="date"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  name="status"
                  value={newTask.status}
                  onChange={handleInputChange}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <button type="submit" className="add-task-btn">
              Add Task
            </button>
          </form>

          <div className="task-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>

          <div className="tasks-list">
            {filteredTasks.length === 0 ? (
              <p className="no-tasks">No tasks found matching your filter.</p>
            ) : (
              filteredTasks.map(task => (
                <div key={task._id} className="task-card">
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    {user.role === 'admin' && (
                      <span className="task-author">By: {task.userId?.name || 'Unknown'}</span>
                    )}
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="delete-btn"
                      aria-label="Delete task"
                    >
                      &times;
                    </button>
                  </div>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  {task.dueDate && (
                    <p className="task-due">
                      <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  <div className="task-footer">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className={`status-select ${task.status}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <span className="task-created">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="auth-required">
          <p>Please log in to view and manage tasks.</p>
        </div>
      )}
    </div>
  );
};

export default TasksPage;