import Link from "next/link";
import React from "react";
import { SlArrowRightCircle } from "react-icons/sl";
import { IoAddCircleOutline } from "react-icons/io5";
import { SlArrowLeftCircle } from "react-icons/sl";
import styles from "./Button.module.css";

const Button = ({ link, text, color, icon }) => {
  return (
    <Link
      href={`/${link}`}
      className={styles.btnParent}
      style={{ color: color === "light" ? "#ffffff" : "#232323" }}
    >
      {
          icon === "add" ? (
        <IoAddCircleOutline className={styles.arrowRight} />
      ) : icon === "left" ? (
        <SlArrowLeftCircle className={styles.arrowRight} />
      ) : (
        <SlArrowRightCircle className={styles.arrowRight} />
      )}
      <span>{text}</span>
    </Link>
  );
};

export default Button;
