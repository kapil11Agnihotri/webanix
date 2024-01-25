import React from "react";
import styles from "./AdminHeader.module.css";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const AdminHeader = () => {
  const router = useRouter();

  const logoutHandler = () => {
    Cookies.remove("refreshToken");
    Cookies.remove("accessToken");
    Cookies.remove("userData");
    router.push("/auth/login");
  };

  return (
    <>
      <div className={styles.header}>
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

        <div className={styles.headerLinks}>
          <div className={styles.headerLink}>
            <Link
              href='# '
              className={styles.headerProfile}
            >
              <FaUser size={15} />
              <span
                style={{
                  marginLeft: "5px",
                }}
              >
                Admin
              </span>
            </Link>
          </div>
          <div
            className={styles.headerLink}
            onClick={(e) => {
              logoutHandler();
            }}
          >
            <Link
              href='/auth/login'
              className={styles.headerLogout}
            >
              <span style={{ marginRight: "5px" }}>Logout</span>
              <FiLogOut size={15} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHeader;
