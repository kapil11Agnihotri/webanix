'use client'
import React, { useState, useEffect } from 'react';
import AdminHeader from '../adminHeader/AdminHeader';
import AdminFooter from '../adminFooter/AdminFooter';
import AdminSidebar from '../adminSidebar/AdminSidebar';
import styles from './AdminLayout.module.css';

const AdminLayout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState('13%');
  const [adminRightWidth, setAdminRightWidth] = useState('87%');

  const handleSidebar = (newState) => {
    setShowSidebar(newState);
  };

  useEffect(() => {
    const handleResize = () => {
     
      // if (window.innerWidth <= 769) {
      //   setShowSidebar(false);
      //   setSidebarWidth('5%');
      //   setAdminRightWidth('95%');
      // }

      if (window.innerWidth <= 1320 && window.innerWidth >= 1025) {
        setSidebarWidth(showSidebar ? '20%' : '3%');
        setAdminRightWidth(showSidebar ? '80%' : '97%');
      }
      else if (window.innerWidth < 1025 && window.innerWidth >= 769) {
        setSidebarWidth(showSidebar ? '25%' : '5%');
        setAdminRightWidth(showSidebar ? '75%' : '95%');
      }
      else if (window.innerWidth < 769 && window.innerWidth > 576) {
        setSidebarWidth(showSidebar ? '35%' : '5%');
        setAdminRightWidth(showSidebar ? '65%' : '95%');
      }
      else if (window.innerWidth <= 576) {
        setSidebarWidth(showSidebar ? '55%' : '5%');
        setAdminRightWidth(showSidebar ? '45%' : '95%');
      }
      else {
        setSidebarWidth(showSidebar ? '13%' : '3%');
        setAdminRightWidth(showSidebar ? '87%' : '97%');
      }
    };

    // Initial setup
    handleResize();

    // Event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [showSidebar]);

  return (
    <>
      <AdminHeader />
      <div className={styles.main}>
        <section className={styles.sidebar} style={{ width: sidebarWidth }}>
          <AdminSidebar onChange={handleSidebar} />
        </section>
        <section
          className={styles.adminRight}
          style={{ width: adminRightWidth }}
        >
          {children}
        </section>
      </div>
      <AdminFooter />
    </>
  );
};

export default AdminLayout;
