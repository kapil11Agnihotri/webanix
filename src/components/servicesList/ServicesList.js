import React from 'react';
import styles from './ServicesList.module.css';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../Button/Button';

const ServicesList = async ({data}) => {
  return (
    <>
      <div className={styles.servicesList}>
        <h2 className={styles.servicesListHeading}>OUR SERVICES</h2>
        <p className={styles.headingText}>
          Select your development focus to find helpful solutions and resources.
        </p>

        <div className={styles.servicesCardsList}>
          {data?.map((card, index) => (
            <div className={styles.servicesCard} key={index}>
              <h3 className={styles.cardHeading}>{card?.title}</h3>
              <p className={styles.cardContent}>{card?.short_description}</p>
              <div className={styles.cardIcons}>
                {JSON.parse(card?.tech_images || "[]")?.map((icon, index) => (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_MAIN_URL}/media/services/${icon?.image}`}
                    height={50}
                    width={50}
                    alt={icon?.alt}
                    key={index}
                    className={styles.cardIcon}
                  />
                ))}
              </div>

              <Button
                text='Learn More'
                link={`services/details/${card?.slug}`}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ServicesList;
