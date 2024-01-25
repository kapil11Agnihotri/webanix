'use client';
import React, { useState } from 'react';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { MdOutlineKeyboardArrowUp } from 'react-icons/md';
import styles from './Details.module.css';

const Details = ({detailsData}) => {
  const [openItemIndex, setOpenItemIndex] = useState(0);

  const toggleAnswer = (index) => {
    setOpenItemIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  return (
    <div className={styles.detailSection}>
      <div className={styles.detailList}>
        {/* <h2 className={styles.detailHeading}>DETAILS</h2> */}
        {detailsData?.map((detail, index) => (
          <div
            className={styles.detailCard}
            key={index}
            style={{
              backgroundImage:
                openItemIndex === index
                  ? `url('/detailBackground.svg')`
                  : undefined,
            }}
          >
            <div className={styles.detailCardUpper}>
              <h3 className={styles.question}>
                
                {detail?.heading}</h3>
              {openItemIndex === index ? (
                <MdOutlineKeyboardArrowUp
                  className={styles.arrowDown}
                  onClick={() => toggleAnswer(index)}
                />
              ) : (
                <MdOutlineKeyboardArrowDown
                  className={styles.arrowDown}
                  onClick={() => toggleAnswer(index)}
                />
              )}
              {/* <MdOutlineKeyboardArrowDown
                className={styles.arrowDown}
                onClick={() => toggleAnswer(index)}
              /> */}
            </div>
            {openItemIndex === index && (
              <div className={styles.answer} dangerouslySetInnerHTML={{__html: detail?.content}}/>
            )}
            <hr
              className={styles.line}
              style={{ display: openItemIndex === index ? 'none' : 'block' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Details;
