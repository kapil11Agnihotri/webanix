"use client";
import React, { useState } from "react";
import styles from "./contacts.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";

const Inquiryform = () => {
  const [submitted, setsubmitted] = useState(false);
  const initialValues = {
    name: "",
    email: "",
    mobile: "",
    designation: "",
    messageText: "",
    query_type: "Inquiry",
  };

  const loginSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is Required"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      let formData = new FormData();

      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });
      try {
        const response = await fetch("/api/admin/queries", {
          method: "POST",
          body: formData,
        });

        const res = await response.json();

        if (res.code === 201) {
          setsubmitted(true);
        }
      } catch (error) {
        // Handle login error
      }
    },
  });

  return (
    <div className={styles.inquiry}>
      <form
        className={styles.loginForm}
        onSubmit={formik.handleSubmit}
      >
        <div className={styles.formUpper}>
          <div className={styles.inputField}>
            <label htmlFor='email'>
              Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className={styles.input}
              type='text'
              name='name'
              id='name'
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              // placeholder='Enter your name'
            />
            {formik.touched.name && formik.errors.name ? (
              <div className={styles.error}>{formik.errors.name}</div>
            ) : null}
          </div>
          <div className={styles.inputField}>
            <label htmlFor='email'>
              Email <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className={styles.input}
              type='email'
              name='email'
              id='email'
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              // placeholder='Enter your email'
            />
            {formik.touched.email && formik.errors.email ? (
              <div className={styles.error}>{formik.errors.email}</div>
            ) : null}
          </div>
          <div className={styles.inputField}>
            <label htmlFor='email'>
              Mobile <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className={styles.input}
              type='tel'
              name='mobile'
              id='mobile'
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              // placeholder='Enter your mobile'
            />
            {formik.touched.mobile && formik.errors.mobile ? (
              <div className={styles.error}>{formik.errors.mobile}</div>
            ) : null}
          </div>
          <div className={styles.inputField}>
            <label htmlFor='email'>
              Designation <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className={styles.input}
              type='text'
              name='designation'
              id='designation'
              value={formik.values.designation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              // placeholder='Enter your designation'
            />
            {formik.touched.designation && formik.errors.designation ? (
              <div className={styles.error}>{formik.errors.designation}</div>
            ) : null}
          </div>
          <div
            className={styles.inputField}
            style={{ width: "100%", padding: "0% 5%" }}
          >
            <label htmlFor='email'>
              Messaage <span style={{ color: "red" }}>*</span>
            </label>
            <textarea
              type='text'
              id='message'
              className={styles.contactusQuery}
              placeholder='Share your queries*'
              rows={2}
              name='messageText'
              value={formik.values.messageText}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.messageText && formik.touched.messageText ? (
              <span className={styles.errorMsg}>
                {formik.errors.messageText}
              </span>
            ) : null}
          </div>
        </div>
        <button
          type='submit'
          className={styles.btn}
        >
          Send
        </button>
        {submitted && (
          <span style={{ color: "green", marginLeft: "5%" }}>
            Sent Successfully!
          </span>
        )}
      </form>
    </div>
  );
};

export default Inquiryform;
