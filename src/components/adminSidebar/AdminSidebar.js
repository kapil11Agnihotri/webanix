import React, { useEffect, useState } from 'react';
import styles from './AdminSidebar.module.css';
import Link from 'next/link';
import { IoMenu } from 'react-icons/io5';
import { HiTemplate } from 'react-icons/hi';
import { SlArrowLeft } from 'react-icons/sl';
import { SlArrowRight } from 'react-icons/sl';
import { CgWebsite } from 'react-icons/cg';
import { usePathname } from 'next/navigation';

const AdminSidebar = ({ onChange }) => {
  const [showMasters, setshowMasters] = useState(false);
  const [showTemplates, setshowTemplates] = useState(false);
  const [showSidebar, setshowSidebar] = useState(true);
  const pathName = usePathname();

  const currentPage = (currentPath) => {
    const check = pathName === currentPath;
    return check;
  };

  const mastersData = [
    { title: 'Users', slug: '/admin/users' },
    { title: 'Blog Categories', slug: '/admin/blog-categories' },
    { title: 'Blogs', slug: '/admin/blogs' },
    { title: 'Service Categories', slug: '/admin/service-categories' },
    { title: 'Services', slug: '/admin/services' },
    { title: 'Queries', slug: '/admin/queries' },
  ];

  const templatesData = [
    { title: 'Home Template', slug: '/admin/home-template' },
    { title: 'About Template', slug: '/admin/about-template' },
    // { title: 'Menus', slug: '/admin/menus' },
  ];

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.adminSidebar}>
          <div
            className={styles.arrow}
            onClick={() => {
              setshowSidebar(!showSidebar);
              onChange(!showSidebar);
              setshowMasters(false);
              setshowTemplates(false);
            }}
          >
            {showSidebar ? <SlArrowLeft /> : <SlArrowRight />}
          </div>

          {showSidebar && (
            <>
              <div
                className={styles.title}
                style={{
                  color: currentPage('/admin/dashboard') ? '#ff6f77' : '',

                  marginTop: '12%',
                }}
              >
                <HiTemplate
                  size={20}
                  style={{
                    color: currentPage('/admin/dashboard') ? '#ff6f77' : '',
                  }}
                />
                <h4
                  className={styles.mastersHeading}
                  onClick={() => {
                    setshowMasters(false), setshowTemplates(false);
                  }}
                >
                  <Link
                    href='/admin/dashboard'
                    style={{
                      textDecoration: 'none',
                      fontWeight: 'none',
                      color: currentPage('/admin/dashboard') ? '#ff6f77' : '',
                    }}
                  >
                    Dashboard
                  </Link>
                </h4>
              </div>
              <div className={styles.masters}>
                <div
                  onClick={() => {
                    setshowMasters(!showMasters), setshowTemplates(false);
                  }}
                  className={styles.title}
                >
                  <IoMenu
                    size={20}
                    style={{
                      color: showMasters ? '#ff6f77' : '',
                    }}
                  />
                  <h4
                    className={styles.mastersHeading}
                    style={{
                      color: showMasters ? '#ff6f77' : '',
                    }}
                  >
                    Masters
                  </h4>
                </div>

                {showMasters && (
                  <ul className={styles.mastersList}>
                    {mastersData.map((item, index) => (
                      <li
                        key={index}
                        className={styles.masterLink}
                        style={{
                          color: currentPage(item.slug) ? '#ff6f77' : '',
                        }}
                      >
                        <Link href={item.slug}>
                          <h2
                            style={{
                              fontSize: '14px',
                              fontWeight: 'unset',
                              margin: '0',

                              color: currentPage(item.slug) ? '#ff6f77' : '',
                            }}
                          >
                            {item.title}
                          </h2>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={styles.templates}>
                <div
                  onClick={() => {
                    setshowMasters(false);
                    setshowTemplates(!showTemplates);
                  }}
                  className={styles.title}
                >
                  <CgWebsite
                    size={20}
                    style={{
                      color: showTemplates ? '#ff6f77' : '',
                    }}
                  />
                  <h2
                    className={styles.templatesHeading}
                    style={{
                      color: showTemplates ? '#ff6f77' : '',
                     
                      
                     
                     
                    }}
                  >
                    Templates
                  </h2>
                </div>
                {showTemplates && (
                  <ul className={styles.templatesList}>
                    {templatesData.map((item, index) => (
                      <li
                        key={index}
                        className={styles.templateLink}
                        style={{
                          color: currentPage(item.slug) ? '#ff6f77' : '',
                          // backgroundColor: currentPage(item.slug)
                          //   ? '#303030'
                          //   : '',
                        }}
                      >
                        <Link href={item.slug}>
                          <h2
                            style={{
                              fontSize: '14px',
                              fontWeight: 'unset',
                              margin: '0',

                              color: currentPage(item.slug) ? '#ff6f77' : '',
                            }}
                          >
                            {item.title}
                          </h2>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
