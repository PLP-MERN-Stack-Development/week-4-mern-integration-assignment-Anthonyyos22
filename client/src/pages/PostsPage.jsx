import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import usePosts from '../hooks/usePosts';
import PostForm from '../components/PostForm';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

const PostsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const {
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
  } = usePosts();

  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const handleSubmit = async (data) => {
    const success = editingPost
      ? await updatePost(editingPost._id, data)
      : await createPost(data);
    if (success) {
      setEditingPost(null);
      setShowForm(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-4">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Blog Posts</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search posts..."
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="drafts">Drafts</option>
          </select>
          {isAuthenticated && (
            <button
              onClick={() => {
                setEditingPost(null);
                setShowForm(!showForm);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {showForm ? <FiX /> : <FiPlus />}
              {showForm ? 'Cancel' : 'New Post'}
            </button>
          )}
        </div>
      </header>

      {(showForm || editingPost) && (
        <PostForm
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingPost(null);
          }}
          initialData={editingPost}
        />
      )}

      {loading ? (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-t-4 border-b-4 border-blue-600 rounded-full animate-spin mx-auto"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No posts found.</div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post._id}
              className="bg-white border rounded-lg shadow hover:shadow-lg overflow-hidden flex flex-col"
            >
              {post.featuredImage && (
                <div className="w-full" style={{ height: '250px', width: '100%' }}>
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${post.featuredImage}`}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    style={{ minHeight: '100px', maxHeight: '250px' }}
                  />
                </div>
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-bold mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{post.content}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {post.categories?.map((cat) => (
                    <span
                      key={cat._id}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-auto">
                  <span>By {post.author?.name || 'Unknown'}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs rounded font-semibold ${
                    post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {post.published ? 'Published' : 'Draft'}
                </span>
                {isAuthenticated && (user?.role === 'admin' || user?._id === post.author?._id) && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        setEditingPost(post);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => deletePost(post._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default PostsPage;
