import { useState, useEffect } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const PostForm = ({ categories, onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categories: [],
    published: false,
    featuredImage: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content,
        categories: initialData.categories?.map((c) => c._id) || [],
        published: initialData.published,
        featuredImage: null,
      });
      if (initialData.featuredImage) {
        setPreviewImage(`${process.env.BACKEND_URL}${initialData.featuredImage}`);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setFormData((f) => ({ ...f, featuredImage: file }));
      setPreviewImage(URL.createObjectURL(file));
    } else if (file) {
      toast.error('Image must be under 5MB');
    }
  };

  const removeImage = () => {
    setFormData((f) => ({ ...f, featuredImage: null }));
    setPreviewImage(null);
  };

  const toggleCategory = (id) => {
    setFormData((f) => ({
      ...f,
      categories: f.categories.includes(id)
        ? f.categories.filter((c) => c !== id)
        : [...f.categories, id],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Title and content required');
      return;
    }
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('published', formData.published);
    formData.categories.forEach((c) => data.append('categories[]', c));
    if (formData.featuredImage) data.append('featuredImage', formData.featuredImage);
    onSubmit(data);
  };

  return (
    <div className="bg-white border rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Post' : 'New Post'}</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={5}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Featured Image</label>
          {previewImage ? (
            <div className="relative mb-4" style={{ height: '250px', width: '100%' }}>
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover rounded"
                style={{ maxHeight: '250px', minHeight: '100px' }}
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
              >
                <FiX />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg py-8 cursor-pointer hover:border-blue-500">
              <FiUpload size={24} className="mb-2 text-gray-500" />
              <span>Click or drag image (Max 5MB)</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>
        {!!categories.length && (
          <div>
            <label className="block mb-1">Categories</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <label key={cat._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(cat._id)}
                    onChange={() => toggleCategory(cat._id)}
                    className="text-blue-600"
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="text-blue-600"
          />
          <label>Publish</label>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
