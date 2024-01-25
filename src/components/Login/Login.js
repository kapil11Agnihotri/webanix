"use client";
import React from "react";
import styles from "./Login.module.css";
import Link from "next/link";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { showErrorToast } from "@/utils/toaster";

const initialValues = {
  email: "",
  password: "",
};

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is Required"),
  password: Yup.string().required("Password is Required"),
});

const Login = () => {

  const router=useRouter();

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          body: JSON.stringify(values),
        }).then((response) => response.json());
  
        if (response.code==200){
        // Handle successful login response
        Cookies.set("userData", JSON.stringify(response.data));
        Cookies.set("refreshToken", response.data.refreshToken);
        Cookies.set("accessToken", response.data.accessToken);
        router.push("/admin/dashboard");
        }
        else if(response.code==401){
          showErrorToast(response.message);
        }
      } catch (error) {
        // Handle login error
        console.error("Login error:", error);
      }
    },
  });
  return (
    <div className={styles.login}>
      <div className={styles.logo}>
        <Link href="/">
          <Image
            className={styles.logoImg}
            src="/logo.webp"
            height={200}
            width={200}
            alt="website_logo"
          />
        </Link>
      </div>
      <div className={styles.loginCard}>
        <div className={styles.upper}>
          <h4 className={styles.cardHeading}>Sign In</h4>
          <p className={styles.cardText}>
            Sign in to your account to continue.
          </p>
        </div>
        <form className={styles.loginForm} onSubmit={formik.handleSubmit}>
          <div className={styles.input}>
            <label htmlFor="email">
              Email <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className={styles.email}
              type="email"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              // placeholder='Enter your email'
            />
            {formik.touched.email && formik.errors.email ? (
              <div className={styles.error}>{formik.errors.email}</div>
            ) : null}
          </div>
          <div className={styles.input}>
            <label htmlFor="password">
              Password <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className={styles.pass}
              type="password"
              name="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              // placeholder='password'
            />
            {formik.touched.password && formik.errors.password ? (
              <div className={styles.error}>{formik.errors.password}</div>
            ) : null}
          </div>
          {/* <Link href='/auth/forgot-password' className={styles.forgotPass}>
            Forgot Password?
          </Link> */}

          <button type="submit" className={styles.btn}>
            Sign In
          </button>
          {/* <p style={{ fontSize: '14px', textAlign: 'center' }}>
            {' '}
            Not registered yet?{' '}
            <Link href='/auth/signup' className={styles.forgotPass}>
              Sign Up
            </Link>
          </p> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
