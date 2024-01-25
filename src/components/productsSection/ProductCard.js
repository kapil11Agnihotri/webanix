import React from 'react'
import styles from './ProductCard.module.css';
import Image from 'next/image';
import Link from 'next/link';


const ProductCard = ({image, heading, content, link}) => {
  return (
    <div className={styles.productCard}>
        <Image
          className={styles.cardImg}
          src={`${process.env.NEXT_PUBLIC_MAIN_URL}media/services/${image}`}
          height={500}
          width={500}
          alt='Product Card'
        />
        
      <div className={styles.cardHeadingSpace}></div>
      <h3 className={styles.cardHeading}>{heading}</h3>
        <p className={styles.cardContent}>{content}</p>
        <div className={styles.link}>
          <Link href={`services/details/${link}`} className={styles.linkBtn}>
            Learn More
          </Link>
      </div>
     
    </div>
  );
}

export default ProductCard;