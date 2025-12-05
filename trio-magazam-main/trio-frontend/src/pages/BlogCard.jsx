import React from 'react';
import { Link } from 'react-router-dom'; // Blog detalına keçmək üçün Link komponentini istifadə edirik

const BlogCard = ({ blog }) => {
  return (
    <article className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5 text-gray-500">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {blog?.category || "Category"}
        </span>
        <span className="text-sm">{blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Date"}</span>
      </div>
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <Link to={`/blog/${blog._id}`}>{blog?.title || "Blog Başlığı"}</Link>
      </h2>
      <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
        {blog?.description || "Qısa açıqlama burada olacaq."}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img className="w-7 h-7 rounded-full" src={blog?.author?.avatar || 'https://via.placeholder.com/150'} alt={blog?.author?.name || "Yazar"} />
          <span className="font-medium dark:text-white">{blog?.author?.name || "Yazar"}</span>
        </div>
        <Link to={`/blog/${blog._id}`} className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline">
          Read more →
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
