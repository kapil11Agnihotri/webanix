import React from "react";
import styles from "./ServicesCard.module.css";
import Button from "../Button/Button";

const ServicesCard = ({ cardHeading, cardContent, detailsLink, colors }) => {
  
  return (
    <div className={styles.cardContainer}>
      <div>
        <h3
          className={styles.cardHeading}
          style={{ color: colors, borderBottom: `4px solid ${colors}` }}
        >
          {cardHeading}
        </h3>
      </div>
      <p className={styles.cardContent}>{cardContent}</p>
      <Button link={`services/details/${detailsLink}`} text={"Learn More"} color={"dark"} />
    </div>
  );
};

export default ServicesCard;
