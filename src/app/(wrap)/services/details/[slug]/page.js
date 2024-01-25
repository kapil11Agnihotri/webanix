import React from 'react';
import styles from '../ServicesDetail.module.css';
import Image from 'next/image';
import Details from './Details';
import { get_service_by_slug } from '@/backend/models/serviceModel';

const Page = async ({ params }) => {
  const { slug } = params;
  const response = await get_service_by_slug(slug);
  const data = response?.data;
  return (
    <>
      <div className={styles.serviceDetail}>
        <div className={styles.servicesDetailBanner}>
          <div className={styles.bannerLeft}>
            <h2 className={styles.bannerHeading}>
              {data?.title}
            </h2>
            <p className={styles.bannerText}>
            {data?.short_description}
            </p>
          </div>
          <div className={styles.bannerRight}>
            {
               slug === "construction-management" ?

               <Image
              src='/cardImg1.webp'
              // src={`${process?.env?.NEXT_PUBLIC_MAIN_URL}media/services/${data?.featured_image}`}
              alt='servicesBannerImg'
              className={styles.bannerImg}
              height={1000}
              width={1000}
            />

            :

            slug === "university-management" ?
            <Image
              src='/cardImg2.webp'
              // src={`${process?.env?.NEXT_PUBLIC_MAIN_URL}media/services/${data?.featured_image}`}
              alt='servicesBannerImg'
              className={styles.bannerImg}
              height={1000}
              width={1000}
            />

            :

            slug === "supply-chain-management" ?

            <Image
              src='/cardImg3.webp'
              // src={`${process?.env?.NEXT_PUBLIC_MAIN_URL}media/services/${data?.featured_image}`}
              alt='servicesBannerImg'
              className={styles.bannerImg}
              height={1000}
              width={1000}
            />

            :

            slug === "logistics-management" ?

            <Image
              src='/cardImg1.webp'
              // src={`${process?.env?.NEXT_PUBLIC_MAIN_URL}media/services/${data?.featured_image}`}
              alt='servicesBannerImg'
              className={styles.bannerImg}
              height={1000}
              width={1000}
            />

            :

            <Image
              // src='/cardImg1.webp'
              src={`${process?.env?.NEXT_PUBLIC_MAIN_URL}media/services/${data?.featured_image}`}
              alt='servicesBannerImg'
              className={styles.bannerImg}
              height={1000}
              width={1000}
            />
            }
          </div>
        </div>

        <Details detailsData = {JSON?.parse(data?.description)}/>

        
      </div>
    </>
  );
};

export default Page;
