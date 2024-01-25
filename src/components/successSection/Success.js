"use client";
import styles from "./Success.module.css";
import React, { useState } from "react";
import Image from "next/image";
import Button from "../Button/Button";

const Success = ({successData}) => {
 

  const readMoreButtonColor = "rgb(60 5 60)";
  const backgroundColor = "rgb(240 235 245)";

   const [currentSlide, setCurrentSlide] = useState(null);

  

  const cardColors = [
    "#4CAF50",
    "#2196F3",
    "#FFC107",
    "#E91E63",
    "#FF9800",
    "#9C27B0",
  ];

  const handleCardHover = (index) => {
    setCurrentSlide(index);
  };

  const handleCardLeave = () => {
    setCurrentSlide(null);
  };

  return (
    <>
      <div
        className={styles.successParent}
        style={{ backgroundColor: backgroundColor }}
      >
        <div className={styles.success}>
          <div className={styles.successInfo}>
            <h2 className={styles.successHeading}>{successData.heading}</h2>
            <p className={styles.successContent}>{successData.content}</p>
            <div style={{ marginTop: "4%" }}>
              <Button
                link="#"
                text=" Read the latest stories"
                color={readMoreButtonColor}
              />
            </div>
          </div>
          <div className={styles.cardContainer}>
            {successData.card.map((card, index) => (
              <div
                key={index}
                className={styles.card}
                onMouseOver={() => handleCardHover(index)}
                onMouseLeave={handleCardLeave}
                style={{
                  backgroundColor:
                    currentSlide === index ? cardColors[index] : "transparent",
                }}
              >
                <Image
                  className={styles.cardImg}
                  src={process.env.NEXT_PUBLIC_IMAGES_URL + `/pages/${card.image}`}
                  height={150}
                  width={150}
                  alt={process.env.NEXT_PUBLIC_IMAGES_URL + `/pages/${card.alt}`}
                />
                {card.image ? (
                  <div className={styles.cardText}>{card.text}</div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Success;
