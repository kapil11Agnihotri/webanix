import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SlArrowRightCircle } from "react-icons/sl";
import styles from "./NewsLetter.module.css";

const NewsLetter = ({newsLetterData}) => {
  return (
    <section>
      
      <div className={styles.infoWholeContent}>
        <div className={styles.info}>
          <Image
            className={styles.infoImg}
            src={
              process.env.NEXT_PUBLIC_IMAGES_URL +
              `/pages/${newsLetterData.image}`
            }
            width={500}
            height={500}
            alt={
              process.env.NEXT_PUBLIC_IMAGES_URL +
              `/pages/${newsLetterData.alt}`
            }
          />
        </div>

        <div className={styles.infoContent}>
          {newsLetterData?.card.map((card, index) => (
            <div
              key={index}
              className={styles.infoContent1}
            >
              <h3 className={styles.infoHeading}>{card.heading}</h3>
              <p className={styles.infoPara}>{card.content}</p>

              
              <Link
                href='/contact-us'
                className={styles.btnParent}
              >
                <SlArrowRightCircle className={styles.arrowRight} />
                <div className={styles.infoSign}>{index == 0 ? 'Sign Up' : index ==1 ? 'Contact Us' : ''}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;