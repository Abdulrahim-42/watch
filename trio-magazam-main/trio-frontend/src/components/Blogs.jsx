import React from "react";
import { useGetBlogsQuery } from "../redux/api/blogApi"; // Blog API hook

const Blogs = () => {
  // Fetch all blogs from backend using RTK Query
  const { data, error, isLoading } = useGetBlogsQuery();

  // Loading state
  if (isLoading) return <div>Yüklənir...</div>;

  // Error state
  if (error) return <div>Xəta baş verdi: {error.message}</div>;

  return (
    <section className="py-16 mt-20 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#fe9034] text-center mb-8">
          Blog Yazıları
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {data?.blogs?.map((blog) => (
            <div
              key={blog._id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md w-full max-w-sm"
            >
              <img
                src={blog.image?.[0]?.url || "https://via.placeholder.com/400x200"}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {blog.title}
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  {blog.description}
                </p>
                <a
                  href={`/blog/${blog._id}`} // Navigates to the blog details page
                  className="text-[#fe9034] hover:underline mt-4 inline-block"
                >
                  Daha çox oxu
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;
