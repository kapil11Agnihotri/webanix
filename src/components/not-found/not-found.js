import Link from "next/link";
import React from "react";
import styles from './not-found.module.css'
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const NotFound = () => {
  return (
    <>
    <Header/>
      <div className={styles.errorPage}>
        <p className={styles.zoom_area}>Oops! Could not find requested resource.</p>
        <section className={styles.error_container}>
          <span className={styles.four}>
            <span className={styles.screen_reader_text}>4</span>
          </span>
          <span className={styles.zero}>
            <span className={styles.screen_reader_text}>0</span>
          </span>
          <span className={styles.four}>
            <span className={styles.screen_reader_text}>4</span>
          </span>
        </section>
        <div className={styles.link_container}>
          <Link
            
            href='/'
            className={styles.more_link}
          >
            Return to Home Page
          </Link>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default NotFound;
