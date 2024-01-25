'use client'
import React, { useState } from 'react';
import styles from './Header.module.css';
import Image from 'next/image';
import { CgMenu, CgClose } from 'react-icons/cg';
import Link from 'next/link';
import { usePathname } from "next/navigation";

const menuData = [
  {
    title: 'About Us',
    slug: '/about-us',
  },
  {
    title: 'Products',
    slug: '/products',
  },
  {
    title: 'Services',
    slug: '/services',
  },
  {
    title: 'Blogs',
    slug: '/blogs',
  },
  {
    title: 'Contact Us',
    slug: '/contact-us',
  },
];

const Header = () => {
  const pathName=usePathname()
  const [mobileView, setmobileView] = useState(false);

  const currentPage =(currentPath)=>{
    const check = pathName === currentPath
    return check;
  }
  return (
    <>
      <nav className={mobileView ? styles.mobileView : styles.header}>
        <div className={styles.logo}>
          <Link href='/'>
            <Image
              className={styles.logoImg}
              src='/logo.webp'
              height={200}
              width={200}
              alt='website_logo'
            />
          </Link>
        </div>
        <div className={mobileView ? styles.mobile_links : styles.headerLinks}>
          {menuData.map((menu, index) => (
            <div className={styles.headerLink} key={index}>
              <Link href={menu?.slug}>
                <div className={styles.menuTitle} style={{color:currentPage(menu?.slug)?"#232323":""}}>{menu?.title}</div>
              </Link>
            </div>
          ))}
        </div>
        <div className={styles.hamburger_menu}>
          <a href='# ' onClick={() => setmobileView(!mobileView)}>
            {mobileView ? (
              <CgClose style={{ color: 'black' }} />
            ) : (
              <CgMenu style={{ color: 'black' }} />
            )}
          </a>
        </div>
      </nav>
    </>
  );
};

export default Header;
