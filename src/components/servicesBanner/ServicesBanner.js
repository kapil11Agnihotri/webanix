import React from "react";
import styles from "./ServicesBanner.module.css";
import Image from "next/image";
const ServicesBanner = async ({data}) => {
  
  return (
    <div className={styles.servicesBanner}>
      <div className={styles.bannerUpper}>       
              <div className={styles.bannerLeft}>
              <h2 className={styles.bannerHeading}>{data[0]?.heading}</h2>
              <div
                className={styles.bannerText}
                dangerouslySetInnerHTML={{ __html: data[0]?.content }}
              />
            </div>
            <div className={styles.bannerRight}>
              <Image
                src={`${process.env.NEXT_PUBLIC_MAIN_URL}/media/categories/${data[0]?.featured_image}`}
                height={1000}
                width={1000}
                alt={`${process.env.NEXT_PUBLIC_MAIN_URL}/media/categories/${data[0]?.alt}`}
                className={styles.bannerImg}
              />
            </div>         
        </div>
    </div>
  );
};

export default ServicesBanner;
