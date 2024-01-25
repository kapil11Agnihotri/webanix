"use client";
import React, { useState } from "react";
import styles from "./Footer.module.css";
import Image from "next/image";
import Button from "../Button/Button";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <>
      <div className={styles.footer1}>
        <div className={styles.footer}>
          <div className={styles.container}>
            <div className={styles.imageContainer}>
              <Image
                src='/logo.webp'
                alt='Follow Us Image'
                width={200}
                height={200}
              />
            </div>

            <div className={styles.followUsSection}>
              <h2 className={styles.mainHeading}>Follow Us</h2>
              <div className={styles.socialMediaLinks}>
                <a
                  href='#'
                  className={styles.socialLink}
                >
                  <FaLinkedin />
                </a>
                <a
                  href='#'
                  className={styles.socialLink}
                >
                  <FaYoutube />
                </a>
                <a
                  href='#'
                  className={styles.socialLink}
                >
                  <FaXTwitter />
                </a>
                <a
                  href='#'
                  className={styles.socialLink}
                >
                  <FaInstagram />
                </a>
                <a
                  href='#'
                  className={styles.socialLink}
                >
                  <FaFacebook />
                </a>
              </div>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={styles.productsSection}>
              <h2 className={styles.mainHeading1}>Products</h2>
              <div className={styles.productCategories}>
                <a
                  href='#'
                  className={styles.productCategory}
                >
                  Artificial Intelligence
                </a>
                <a
                  href='#'
                  className={styles.productCategory}
                >
                  AR/VR
                </a>
                <a
                  href='#'
                  className={styles.productCategory}
                >
                  Business Tools
                </a>
                <a
                  href='#'
                  className={styles.productCategory}
                >
                  Gaming
                </a>
                <a
                  href='#'
                  className={styles.productCategory}
                >
                  Open Source
                </a>
                <a
                  href='#'
                  className={styles.productCategory}
                >
                  Publishing
                </a>
                <a
                  href='#'
                  className={styles.productCategory}
                >
                  Social Integrations
                </a>
                <a
                  href='#'
                  className={styles.productCategory}
                >
                  Social Presence
                </a>
              </div>
            </div>
            <div className={styles.section1}>
              <div className={styles.programsSection}>
                <h2 className={styles.mainHeading1}>Programs</h2>
                <div className={styles.programLinks}>
                  <a
                    href='#'
                    className={styles.programLink}
                  >
                    ThreatExchange
                  </a>
                </div>
              </div>

              <div className={styles.supportSection}>
                <h2 className={styles.mainHeading1}>Support</h2>
                <div className={styles.supportLinks}>
                  <a
                    href='#'
                    className={styles.supportLink}
                  >
                    Developer Support
                  </a>
                  <a
                    href='#'
                    className={styles.supportLink}
                  >
                    Bugs
                  </a>
                  <a
                    href='#'
                    className={styles.supportLink}
                  >
                    Platform Status
                  </a>
                  <a
                    href='#'
                    className={styles.supportLink}
                  >
                    Report a Platform Data Incident
                  </a>
                  <a
                    href='#'
                    className={styles.supportLink}
                  >
                    Facebook for Developers Community Group
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.section2}>
              <div className={styles.newsSection}>
                <h2 className={styles.mainHeading1}>News</h2>
                <div className={styles.newsLinks}>
                  <a
                    href='#'
                    className={styles.newsLink}
                  >
                    Blog
                  </a>
                  <a
                    href='#'
                    className={styles.newsLink}
                  >
                    Success Stories
                  </a>
                  <a
                    href='#'
                    className={styles.newsLink}
                  >
                    Videos
                  </a>
                  <a
                    href='#'
                    className={styles.newsLink}
                  >
                    Meta for Developers Page
                  </a>
                </div>
              </div>

              <div className={styles.termsSection}>
                <h2 className={styles.mainHeading1}>Terms and Policies</h2>
                <div className={styles.termsLinks}>
                  <a
                    href='#'
                    className={styles.termsLink}
                  >
                    Platform Initiatives Hub
                  </a>
                  <a
                    href='#'
                    className={styles.termsLink}
                  >
                    Platform Terms
                  </a>
                  <a
                    href='#'
                    className={styles.termsLink}
                  >
                    Developer Policies
                  </a>
                  <a
                    href='#'
                    className={styles.termsLink}
                  >
                    European Commission Commitments
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.hr}>
          <hr />
        </div>

        <div className={styles.content}>
          <div className={styles.additionalContent}>
            <p>© 2024 Webanix</p>
          </div>
          <div className={styles.additionalLinks}>
            <a href='#'>About</a>
            <a href='#'>Products</a>
            <a href='#'>Services</a>
            <a href='#'>Blogs</a>
            <a href='#'>Contact Us</a>
            <a href='#'>Terms</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
