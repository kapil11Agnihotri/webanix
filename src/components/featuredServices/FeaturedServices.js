import React from "react";
import styles from "./FeaturedServices.module.css";
import Image from "next/image";
import Link from "next/link";
import { get_services } from "@/backend/models/serviceModel";


const FeaturedServices = async ({data}) => {
  return (
    <>
      <div className={styles.featuredServices}>
        <h2 className={styles.featuredHeading}>FEATURED SERVICES</h2>
        <p className={styles.headingText}>
          Explore developer solutions and cross-product integrations from
          Webanix.
        </p>
        <div className={styles.cardsList}>
          {data.map((card, index) => (
            <div className={styles.card} key={index}>
              <div className={styles.cardUpper}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_MAIN_URL}/media/services/${card?.featured_image}`}
                  height={500}
                  width={500}
                  alt={card?.alt}
                  className={styles.cardImg}
                />
              </div>
              <div className={styles.cardLower}>
                <h3 className={styles.cardHeading}>{card?.title}</h3>
                <p className={styles.cardText}>{card?.short_description}</p>
                <div className={styles.cardIcons}>
                 
                  {JSON.parse(card?.tech_images || "[]").map((icon, index) => (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_MAIN_URL}media/services/${icon?.image}`}
                      height={50}
                      width={50}
                      alt={icon?.alt}
                      key={index}
                      className={styles.cardIcon}
                    />
                  ))}
                </div>
                <Link
                  href={`services/details/${card?.slug}`}
                  className={styles.learnMoreBtn}
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FeaturedServices;
