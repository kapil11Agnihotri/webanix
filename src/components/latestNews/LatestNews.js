"use client";
import React, { useState } from "react";
import styles from "./LatestNews.module.css";
import Image from "next/image";
import Button from "../Button/Button";
import Link from "next/link";
import moment from "moment";

const LatestsSection = ({ newsData }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleHeadingHover = (index) => {
    setHoveredIndex(index);
  };

  const handleHeadingLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <>
      <div className={styles.latestsSection}>
        <h2 className={styles.mainHeading}>LATEST NEWS</h2>

        <div className={styles.latestsList}>
          {newsData?.map((latest, index) => (
            <div
              key={index}
              className={styles.latest}
              onMouseEnter={() => handleHeadingHover(index)}
              onMouseLeave={handleHeadingLeave}
            >
              <Link href={`/blogs/details/${latest?.slug}`}>
                <div className={styles.imageContainer}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_MAIN_URL}media/blogs/${latest?.featured_image}`}
                    alt={`${latest?.alt}`}
                    width={500}
                    height={200}
                  />
                </div>
              </Link>
              <div className={styles.textContainer}>
                <Link href={`/blogs/details/${latest?.slug}`} style={{textDecoration:'none'}}>
                  <h3
                    className={`${styles.heading} ${
                      hoveredIndex === index ? styles.hovered : ""
                    }`}
                  >
                    {latest?.title}
                  </h3>
                </Link>
                <p className={styles.date}>
                  {moment(new Date(latest?.publish_date)).format('DD/MMM/YYYY')}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div>
          <hr />
          <div className={styles.button}>
              <Button link="blogs" text="See More News" />
          </div>
        </div>
      </div>
    </>
  );
};

export default LatestsSection;
