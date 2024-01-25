'use client';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import styles from './Banner.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import Button from '../Button/Button';

const Banner = ({bannerData}) => {
  const [customColor, setcustomColor] = useState('light');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 576) {
        setcustomColor('dark');
      } else {
        setcustomColor('light');
      }
    };

    // Initial check on mount
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    appendDots: (dots) => (
      <div>
        <ul className={styles.dotsList}> {dots} </ul>
      </div>
    ),
  };
 

  return (
    <>
      <div>
        <Slider
          {...sliderSettings}
          style={{ overflow: "hidden" }}
        >
          {bannerData.map((banner, index) => (
            <div
              className={styles.bannerParent}
              key={index}
            >
              <div className={styles.banner}>
                <div
                  className={styles.bannerLeft}
                  style={{
                    backgroundColor:
                      index === 0
                        ? "#182a34"
                        : index === 1
                        ? "#702a34"
                        : index === 2
                        ? " #343434"
                        : undefined,
                  }}
                >
                  <div className={styles.bannerInfo}>
                    <h2 className={styles.bannerHeading}>{banner.heading}</h2>
                    <p className={styles.bannerContent}>{banner.content}</p>
                    <div style={{ marginTop: "4%" }}>
                      <Button
                        link='# '
                        text='Learn More'
                        color={customColor}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.bannerRight}>
                  <Image
                    className={styles.bannerImg}
                    src={
                      process.env.NEXT_PUBLIC_IMAGES_URL +
                      `/pages/${banner.image}`
                    }
                    height={1000}
                    width={1000}
                    alt={
                      process.env.NEXT_PUBLIC_IMAGES_URL +
                      `/pages/${banner.alt}`
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default Banner;
