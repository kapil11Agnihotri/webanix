import { get_blogs } from "@/backend/models/blogModel";
import FeaturedBlogs from "./FeaturedBlogs";
import LatestBlogs from "./LatestBlogs";

const BlogsPage = async () => {

  const response = await get_blogs();

  let blogs = response?.data?.filter((blog) => {
    return blog.status == 2;
  });

  const featuredBlog = blogs?.filter((blog) => {
    return blog?.blog_type_name == "Featured Blogs";
  });
  
  const listingBlog = blogs?.filter((blog) => {
    return blog?.blog_type_name == "Listing";
  });

  return (
    <>
      <FeaturedBlogs blogsData={featuredBlog} />
      <LatestBlogs blogsData={listingBlog} />
    </>
  );
};

export default BlogsPage;
