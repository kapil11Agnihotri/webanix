import React from "react";
import styles from "./about.module.css";
import { BsPeopleFill } from "react-icons/bs";
import { ImQuotesLeft } from "react-icons/im";
import Image from "next/image";
import Banner from "./Banner";
import Button from "../Button/Button";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const About =({ pageData }) => {
  const aboutData = JSON.parse(JSON.parse(pageData?.page_json));

  return (
    <>
      <Header />
      <Banner bannerData={aboutData?.bannerSection} />
      <div className={styles.aboutPage}>
        <div className={styles.aboutServices}>
          <div className={styles.aboutServicesLeft}>
            <Image
              src={
                process.env.NEXT_PUBLIC_IMAGES_URL +
                `/pages/${aboutData?.servicesSection?.image}`
              }
              alt={
                process.env.NEXT_PUBLIC_IMAGES_URL +
                `/pages/${aboutData?.servicesSection?.alt}`
              }
              className={styles.aboutServicesImg}
              height={410}
              width={1200}
            />
          </div>
          <div className={styles.aboutServicesRight}>
            <h4 className={styles.aboutServicesHeading}>
              {aboutData?.servicesSection?.heading}
            </h4>
            <p className={styles.aboutServicesText}>
              {aboutData?.servicesSection?.content}
            </p>
            <div className={styles.aboutServicesList}>
              {aboutData?.servicesSection?.card?.map((service, index) => (
                <div
                  key={index}
                  className={styles.aboutServicesCard}
                >
                  <BsPeopleFill className={styles.servicesCardIcon} />
                  <h4 className={styles.servicesCardHeading}>
                    {service?.heading}
                  </h4>
                  <p className={styles.servicesCardText}>{service?.content}</p>
                  <div>
                    <Button
                      link={"#"}
                      text={"Know Details"}
                      color={""}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.taglineSection}>
          <ImQuotesLeft className={styles.quoteIcon} />

          <h3 className={styles.taglineText}>
            <div
              dangerouslySetInnerHTML={{ __html: aboutData?.midPageHeading }}
            />
          </h3>
          <p className={styles.taglineBottom}>WEBANIX</p>
        </div>

        <div className={styles.aboutServices}>
          <div className={styles.aboutServicesLeft}>
            <Image
              src={
                process.env.NEXT_PUBLIC_IMAGES_URL +
                `/pages/${aboutData?.productsSection?.image}`
              }
              alt={
                process.env.NEXT_PUBLIC_IMAGES_URL +
                `/pages/${aboutData?.productsSection?.alt}`
              }
              className={styles.aboutServicesImg}
              height={400}
              width={1200}
            />
          </div>
          <div className={styles.aboutServicesRight}>
            <h4 className={styles.aboutServicesHeading}>PRODUCTS</h4>
            <p className={styles.aboutServicesText}>
              {aboutData?.productsSection?.heading}
            </p>
            <div className={styles.aboutServicesList}>
              {aboutData?.productsSection?.card?.map((service, index) => (
                <div
                  key={index}
                  className={styles.aboutServicesCard}
                >
                  <BsPeopleFill className={styles.servicesCardIcon} />
                  <h4 className={styles.servicesCardHeading}>
                    {service.heading}
                  </h4>
                  <p className={styles.servicesCardText}>{service.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default About;
