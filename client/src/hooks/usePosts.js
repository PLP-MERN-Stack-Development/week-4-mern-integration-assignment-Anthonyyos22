import { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';

export default function usePosts() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsRes, categoriesRes] = await Promise.all([
          api.get('/posts'),
          api.get('/categories'),
        ]);
        setPosts(Array.isArray(postsRes.data.posts) ? postsRes.data.posts : []);
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const createPost = async (data) => {
    try {
      const res = await api.post('/posts', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPosts([res.data, ...posts]);
      toast.success('Post created');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed');
      return false;
    }
  };

  const updatePost = async (id, data) => {
    try {
      const res = await api.put(`/posts/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPosts(posts.map((p) => (p._id === res.data._id ? res.data : p)));
      toast.success('Post updated');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
      return false;
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
      toast.success('Post deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'published' && post.published) ||
      (filter === 'drafts' && !post.published);
    return matchSearch && matchFilter;
  });

  return {
    posts,
    categories,
    loading,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    createPost,
    updatePost,
    deletePost,
    filteredPosts,
  };
}
