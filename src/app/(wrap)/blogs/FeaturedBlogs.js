"use client";
import React, { useEffect, useState } from "react";
import styles from "./FeaturedBlogs.module.css";
import Image from "next/image";
import Link from "next/link";

// FeaturedBlogs component to display featured blogs
const FeaturedBlogs = ({ blogsData }) => {
  // useEffect hook to handle side effects
  useEffect(() => {
    // add any effects here
  }, [blogsData]);

  function formatDateString(dateString) {
    const dateObject = new Date(dateString);
    // Get day, month, and year
    const month = dateObject.toLocaleString('en-US', { month: 'long' });
    const day = dateObject.getUTCDate();
    const year = dateObject.getUTCFullYear();
    // Format the date as "dd MMM, yyyy"
    const formattedDate = `${month} ${day}, ${year}`;
    return formattedDate;
  }

  return (
    <div className={styles.blogWholeContent}>
      {/* Featured section */}
      <div className={styles.featured}>FEATURED</div>

      <div className={styles.blogInner}>
        {/* Display featured blog (first in list) */}
        {blogsData?.slice(0, 1).map((blog, index) => (
          <div className={styles.blogLeftContent} key={index}>
            <Link
              href={`blogs/details/${blog?.slug}`}
              style={{ textDecoration: "none", color: "#232323" }}
            >
              {/* Featured image */}
              <div className={styles.imgCover}>
                <Image
                  className={styles.blogImg}
                  src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/blogs/${blog.featured_image}`}
                  alt="featured image"
                  width={300}
                  height={300}
                />
              </div>

              {/* Blog details */}
              <div className={styles.blogDetails}>
                <div className={styles.contentBlogDate}>
                  {formatDateString(blogsData[0]?.publish_date)}
                </div>
                <div className={styles.leftBlogHeading}>
                  {blogsData[0].title}
                </div>
                <div className={styles.bothBlogContent}>
                  {blogsData[0].short_description}
                </div>
              </div>
            </Link>
          </div>
        ))}

        {/* Display other featured blogs */}
        <div className={styles.blogRightContent}>
          {blogsData?.slice(1, 4).map((blog, index) => (
            <Link
              href={`blogs/details/${blog?.slug}`}
              style={{ textDecoration: "none", color: "#232323" }} key={index}
            >
              <div className={styles.contents} key={index}>
                {/* Blog details */}
                <div className={styles.leftCover}>
                
                  <div className={styles.contentBlogDate}>  {formatDateString(blogsData[0]?.publish_date)} </div>
                  <div className={styles.rightBlogHeading1}>
                    {blog?.title.length >= 45
                      ? blog?.title.slice(0, 45) + "..."
                      : blog?.title}
                  </div>
                  <div className={styles.bothBlogContent1}>
                    {blog?.short_description.length >= 90
                      ? blog?.short_description.slice(0, 90) + "..."
                      : blog?.short_description}
                  </div>
                  <div className={styles.rightBlogHeading2}>
                    {blog.title.length >= 40
                      ? blog.title.slice(0, 40) + "..."
                      : blog?.title}
                  </div>
                  <div className={styles.bothBlogContent2}>
                    {blog.short_description.length >= 60
                      ? blog.short_description.slice(0, 60) + "..."
                      : blog?.short_description}
                  </div>
                </div>

                {/* Featured image */}
                <div className={styles.rightCover}>
                  <Image
                    alt="featured image"
                    width={500}
                    height={500}
                    src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/blogs/${blog.featured_image}`}
                    className={styles.rightCoverImg}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedBlogs;
