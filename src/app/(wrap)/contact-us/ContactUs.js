"use client";
import React, { useState } from "react";
import styles from "./contacts.module.css";
import Link from "next/link";
import { FcQuestions } from "react-icons/fc";
import { FcCalendar } from "react-icons/fc";
import { FcSalesPerformance } from "react-icons/fc";
import { MdOutlineMailOutline } from "react-icons/md";
import { FcBriefcase } from "react-icons/fc";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FcCallback } from "react-icons/fc";
import { FaXTwitter } from "react-icons/fa6";
import { RiMapPin2Line } from "react-icons/ri";
import ServicesBanner from "@/components/servicesBanner/ServicesBanner";
import Applyform from "./Applyform";
import Inquiryform from "./Inquiryform";

function ContactUs() {
  const [hireButton, setHireButton] = useState(true);
  const [applyButton, setApplyButton] = useState(false);
  const [showinquiry, setshowinquiry] = useState(false);
  const [showapplyForm, setshowapplyForm] = useState(false);

  const contactUsBanner = [
    {
      heading: "Get In Touch",
      content:
        "Want to get in touch? We'd love to hear from you. Here's how you can reach us...",
      featured_image: "87723695-9a0a-4ac7-8046-5b292a5be666.webp",
    },
  ];


  const handleInquiryAction = () => {
       window.location.href = "tel:+16198157158"; // Replace with your phone number
  };


  return (
    <>
      <ServicesBanner data={contactUsBanner} />
      <hr style={{ margin: "2% 5%" }} />
      <div className={styles.mainContainer}>
        <div className={styles.flexContainer}>
          <div className={styles.leftSection}>
            <button
              className={styles.leftButtons}
              style={{
                backgroundColor: hireButton ? "#fe4550" : "",
                color: hireButton ? "#ffffff" : "#000000",
              }}
              onClick={() => {
                setHireButton(true);
                setApplyButton(false);
                setshowinquiry(false);
              }}
            >
              Hire a Talent
            </button>

            <button
              className={styles.leftButtons}
              style={{
                backgroundColor: applyButton ? "#fe4550" : "",
                color: applyButton ? "#ffffff" : "#000000",
              }}
              onClick={() => {
                setHireButton(false);
                setApplyButton(true);
                setshowinquiry(false);
              }}
            >
              Apply for a Job
            </button>
          </div>
          {hireButton ? (
            <div className={styles.rightSection}>
              <div className={styles.rightInnerSection}>
                <div className={styles.card} onClick={() => {window.location.href = "tel:+16198157158";}}>
                  <FcCallback className={styles.iconSize} />
                  <h3 className={styles.text}>Get In Touch</h3>
                </div>
                <div
                  className={styles.card}
                  onClick={() => setshowinquiry(!showinquiry)}
                  style={{
                    backgroundColor: showinquiry ? "#f4f4f4" : "#ffffff",
                  }}
                >
                  <FcQuestions className={styles.iconSize} />
                  <h3 className={styles.text}>Send us inquiry</h3>
                  <p
                    style={{
                      lineHeight: "15px",
                      color: "gray",
                      fontSize: "12px",
                    }}
                  >
                    +1 619 815 7158
                  </p>
                </div>
                <div className={styles.card}
                  onClick={() => { window.location.href = "mailto:hello@webanix.com"; }}
                >
                  <MdOutlineMailOutline className={styles.iconSize} />
                  <h3 className={styles.text}>Send an Email</h3>
                  <p
                    style={{
                      lineHeight: "15px",
                      color: "gray",
                      fontSize: "12px",
                    }}
                  >
                    hello@webanix.com
                  </p>
                </div>
                <hr className={styles.hr} />
                {showinquiry && <Inquiryform />}
              </div>
            </div>
          ) : (
            <div className={styles.rightSection}>
              <div className={styles.rightInnerSection}>
                <div
                  className={styles.card}
                  onClick={() => setshowapplyForm(!showapplyForm)}
                >
                  <div>
                    <FcBriefcase className={styles.iconSize} />
                    <h3 className={styles.text}>Apply for a Job</h3>
                  </div>
                </div>
              </div>
              <hr className={styles.hr} />

              {showapplyForm && <Applyform />}
            </div>
          )}
        </div>
      </div>

      <div className={styles.downContainer}>
        <div className={styles.column1}>
          <p style={{ cursor: "pointer" }}>770 015 3708</p>
          <p style={{ cursor: "pointer" }}>hello@webanix.com</p>
          {/* <div className={styles.socialMediaLinks}>
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
          </div> */}
        </div>
        <div className={styles.column2}>
          <h6>careers@webanix.in</h6>
          <p>Job Openings, Career Opportunities, Internships</p>
          <h6>invoice@webanix.in</h6>
          <p>Billings, Invoices, Refunds</p>
          <h6>Our official emails / domains</h6>
          <p>
            Our official domains are only webanix.com and webanix.in, please
            only coordinate from emails with{" "}
            <span style={{ fontWeight: 600 }}>@webanix.com</span> and{" "}
            <span style={{ fontWeight: 600 }}>@webanix.in</span>
          </p>
        </div>
        <div className={styles.column3}>
          <div>
            <RiMapPin2Line size={25} />
            <span>{" "}United States</span>
            <p>
              {" "}
              2810 N Church St Wilmington, Delaware 19802-4447 
            </p>
          </div>
          <div>
            <RiMapPin2Line size={25} />
            <span>{" "}India</span>
            <p>
              {" "}
              Panchwati, Udaipur
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactUs;
