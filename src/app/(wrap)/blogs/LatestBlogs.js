"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import classes from "./LatestBlogs.module.css";

// LatestBlogs component to display latest blogs
const LatestBlogs = ({ blogsData }) => {
  // Hook to handle blog count state
  const [blogCount, setBlogCount] = useState([6]);
  // Use effect hook to handle side effects

  function formatDateString(dateString) {
    const dateObject = new Date(dateString);
    // Get day, month, and year
    const month = dateObject.toLocaleString("en-US", { month: "long" });
    const day = dateObject.getUTCDate();
    const year = dateObject.getUTCFullYear();
    // Format the date as "dd MMM, yyyy"
    const formattedDate = `${month} ${day}, ${year}`;
    return formattedDate;
  }
  return (
  <>
      {/* Container for entire blogs content */}
      <div className={classes.blogsWholeContent}>
        {/* Upper heading section */}
        <div className={classes.headingUpper}></div>
        {/* Main heading */}
        <div className={classes.heading}>LATEST BLOGS</div>
        {/* List of blog cards */}
        <div className={classes.blogsList}>
          {blogsData?.slice(0, blogCount).map((blog, index) => (
            <div className={classes.blogCard} key={index}>
              {/* Upper section with date */}
              <div className={classes.blogCardUpper}>
                <div className={classes.blogDate}>
                  {formatDateString(blog?.publish_date)}
                </div>
              </div>

              {/* Link to blog details page */}
              <Link href={`blogs/details/${blog?.slug}`}>
                {/* Lower section with title and image */}
                <div className={classes.blogCardLower}>
                  {/* Blog title */}
                  <p className={classes.blogCardText}>
                    {blog?.title.length >= 60
                      ? blog?.title.slice(0, 60) + "..."
                      : blog?.title}
                  </p>

                  {/* Featured image */}
                  {blog?.featured_image && (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/blogs/${blog.featured_image}`}
                      alt="blogCardImage"
                      className={classes.blogCardImg}
                      width={100}
                      height={100}
                      priority
                    />
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
     
      {/* Load more button */}
      {blogCount >= blogsData?.length ? null : (
        <div className={classes.btnContainer}>
          <button
            className={classes.loadBtn}
            onClick={() => setBlogCount((prev) => prev + 6)}
          >
            Load More Blogs
          </button>
        </div>
      )}
      </>
  );
};

export default LatestBlogs;
