import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SlArrowRightCircle } from "react-icons/sl";
import styles from "./Banner.module.css";
import Button from "@/components/Button/Button";

const Banner = ({bannerData}) => {
  return (
    <section>
      <div className={styles.infoWholeContent}>
        <div className={styles.info}>
          <Image
            className={styles.infoImg}
            src={
              process.env.NEXT_PUBLIC_IMAGES_URL +
              `/pages/${bannerData.backgroundImage}`
            }
            width={500}
            height={500}
            alt={
              process.env.NEXT_PUBLIC_IMAGES_URL +
              `/pages/${bannerData.alt}`
            }
          />
        </div>
        <div className={styles.infoContent}>
          <div className={styles.infoContent1}>
            <h3 className={styles.infoHeading}>{bannerData?.heading}</h3>
            <p className={styles.infoPara}>{bannerData?.content}</p>

            <div className={styles.button}>
              <Button
                link={"contact-us"}
                text={"Get A Consultaion"}
                color={"dark"}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
