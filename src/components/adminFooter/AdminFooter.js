import React from 'react'
import styles from './AdminFooter.module.css'

const AdminFooter = () => {
  return (
    <>
      <div className={styles.adminFooter}>
        <h5 className={styles.footerLeft}>Copyright © {new Date().getFullYear()} Webanix Solutions.</h5>
        <h5 className={styles.footerRight}>Designed byWEBaniX Pvt Ltd.</h5>
      </div>
    </>
  );
}

export default AdminFooter