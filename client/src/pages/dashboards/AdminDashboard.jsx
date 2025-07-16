import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  // Fetch all data on tab change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        switch (activeTab) {
          case 'categories':
            const catRes = await api.get('/categories');
            setCategories(catRes.data);
            break;
          case 'tasks':
            const taskRes = await api.get('/tasks');
            setTasks(taskRes.data);
            break;
          case 'posts':
            const postRes = await api.get('/posts');
            setPosts(postRes.data);
            break;
          case 'users':
            const userRes = await api.get('/users');
            setUsers(userRes.data);
            break;
        }
      } catch (error) {
        toast.error(`Failed to load ${activeTab} data`);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchData();
    }
  }, [activeTab, user]);

  // Category Management
  const handleAddCategory = async () => {
    try {
      const res = await api.post('/categories', newCategory);
      setCategories([...categories, res.data]);
      setNewCategory({ name: '', description: '' });
      toast.success('Category added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add category');
    }
  };

  // Task Management
  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  // Post Management
  const handleTogglePostStatus = async (postId, currentStatus) => {
    try {
      const res = await api.patch(`/posts/${postId}`, { published: !currentStatus });
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, published: res.data.published } : post
      ));
      toast.success(`Post ${currentStatus ? 'unpublished' : 'published'}`);
    } catch (error) {
      toast.error('Failed to update post status');
    }
  };

  // User Management
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await api.patch(`/users/${userId}`, { role: newRole });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      toast.success('User role updated');
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <p>Welcome, <strong>{user?.name}</strong> ({user?.role})</p>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'categories' ? 'active' : ''}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
        <button 
          className={activeTab === 'tasks' ? 'active' : ''}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button 
          className={activeTab === 'posts' ? 'active' : ''}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      <div className="dashboard-content">
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="dashboard-overview">
                <div className="stats-card">
                  <h3>Total Users</h3>
                  <p>{users.length}</p>
                </div>
                <div className="stats-card">
                  <h3>Active Tasks</h3>
                  <p>{tasks.filter(t => t.status !== 'completed').length}</p>
                </div>
                <div className="stats-card">
                  <h3>Published Posts</h3>
                  <p>{posts.filter(p => p.published).length}</p>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="categories-management">
                <div className="add-category">
                  <h3>Add New Category</h3>
                  <input
                    type="text"
                    placeholder="Category Name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  />
                  <button onClick={handleAddCategory}>Add Category</button>
                </div>
                <div className="categories-list">
                  <h3>Existing Categories</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(category => (
                        <tr key={category._id}>
                          <td>{category.name}</td>
                          <td>{category.description}</td>
                          <td>
                            <button className="edit-btn">Edit</button>
                            <button className="delete-btn">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="tasks-management">
                <h3>All System Tasks</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Assignee</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map(task => (
                      <tr key={task._id}>
                        <td>{task.title}</td>
                        <td>{task.userId?.name || 'Unassigned'}</td>
                        <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                        <td>
                          <select 
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="posts-management">
                <h3>All Blog Posts</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map(post => (
                      <tr key={post._id}>
                        <td>{post.title}</td>
                        <td>{post.author?.name || 'Unknown'}</td>
                        <td>
                          <span className={`status ${post.published ? 'published' : 'draft'}`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => handleTogglePostStatus(post._id, post.published)}
                          >
                            {post.published ? 'Unpublish' : 'Publish'}
                          </button>
                          <button className="delete-btn">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="users-management">
                <h3>User Management</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Current Role</th>
                      <th>Change Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                          >
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                            <option value="user">User</option>
                          </select>
                        </td>
                        <td>
                          <button className="delete-btn">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;