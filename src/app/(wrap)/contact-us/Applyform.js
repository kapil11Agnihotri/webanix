'use client'
import React, { useState } from 'react'
import styles from './contacts.module.css'
import { useFormik } from "formik";
import * as Yup from "yup";
import { showErrorToast, showSuccessToast } from '@/utils/toaster';

const Applyform = () => {
const [submitted, setsubmitted] = useState(false);
    
     const initialValues = {
       name: "",
       email: "",
         mobile: "",
      document: '',
       designation: "",
       messageText: "",
       linkedin: "",
       current_ctc: "",
       expected_ctc: "",
       notice_period: "",
       experience: "",
       query_type: "Career",
     };

     const applySchema = Yup.object({
       name: Yup.string()
         .min(2)
         // .max(150, 'Name should not exceed 150 characters')
         .required("Please enter a valid Name!"),

       email: Yup.string()
         .matches(
           /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
           "Please enter a valid Email!"
         )
         .required("Email is required"),

       mobile: Yup.string()
         .matches(/^\d{10}$/, "Phone number should be 10 digits")
         .required("Please enter a valid phone number"),

      
       experience: Yup.number()
         .integer("Experience should be a whole number")
         .min(0, "Experience should be a positive number")
         // .max(3, 'Experience should not exceeds 3 digits')
         .required("Please enter a valid Experience"),

       current_ctc: Yup.number()
         .min(0, "Current Salary should be a positive number")
         // .max(10, 'Current salary should not exceeds 10 digits')
         .required("Please enter a valid Current Salary"),

       expected_ctc: Yup.number()
         .min(0, "Expected Salary should be a positive number")
         // .max(10, 'Expected salary should not exceeds 10 digits')
         .required("Please enter a valid Expected Salary"),

       notice_period: Yup.number()
         .integer("Notice Period should be a whole number")
         .min(0, "Notice Period should be a positive number")
         // .max(3,"Notice period should not exceeds 3 digits")
         .required("Please enter a valid Notice Period"),

      document: Yup.mixed().required("Please upload your resume"),

       message: Yup.string().required(
         "Please specify the source of application"
       ),

     
     });

     const formik = useFormik({
       initialValues: initialValues ,
    //    validationSchema: applySchema,
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
             console.error("Form submission error:", error);
         }
       },
     });
  return (
    <div className={styles.career}>
      <form
        className={styles.loginForm}
        onSubmit={formik.handleSubmit}
      >
        <div className={styles.formUpper}>
          {/* Existing fields */}
          <div className={styles.inputField}>
            <label htmlFor='name'>
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
            />
            {formik.touched.email && formik.errors.email ? (
              <div className={styles.error}>{formik.errors.email}</div>
            ) : null}
          </div>
          <div className={styles.inputField}>
            <label htmlFor='mobile'>
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
            />
            {formik.touched.mobile && formik.errors.mobile ? (
              <div className={styles.error}>{formik.errors.mobile}</div>
            ) : null}
          </div>
          <div className={styles.inputField}>
            <label htmlFor='designation'>
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
            />
            {formik.touched.designation && formik.errors.designation ? (
              <div className={styles.error}>{formik.errors.designation}</div>
            ) : null}
          </div>
          {/* Additional fields */}

          <div className={styles.inputField}>
            <label htmlFor='company_name'>
              Current Company Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className={styles.input}
              type='text'
              name='company_name'
              id='company_name'
              value={formik.values.company_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.company_name && formik.errors.company_name ? (
              <div className={styles.error}>{formik.errors.company_name}</div>
            ) : null}
          </div>

          <div className={styles.inputField}>
            <label htmlFor='linkedin'>
              LinkedIn <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className={styles.input}
              type='text'
              name='linkedin'
              id='linkedin'
              value={formik.values.linkedin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.linkedin && formik.errors.linkedin ? (
              <div className={styles.error}>{formik.errors.linkedin}</div>
            ) : null}
          </div>

          <div className={styles.inputField}>
            <label htmlFor='current_ctc'>
              Current CTC <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className={styles.input}
              type='text'
              name='current_ctc'
              id='current_ctc'
              value={formik.values.current_ctc}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.current_ctc && formik.errors.current_ctc ? (
              <div className={styles.error}>{formik.errors.current_ctc}</div>
            ) : null}
          </div>

          <div className={styles.inputField}>
            <label htmlFor='expected_ctc'>
              Expected CTC <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className={styles.input}
              type='text'
              name='expected_ctc'
              id='expected_ctc'
              value={formik.values.expected_ctc}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.expected_ctc && formik.errors.expected_ctc ? (
              <div className={styles.error}>{formik.errors.expected_ctc}</div>
            ) : null}
          </div>

          <div className={styles.inputField}>
            <label htmlFor='notice_period'>
              Notice Period <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className={styles.input}
              type='text'
              name='notice_period'
              id='notice_period'
              value={formik.values.notice_period}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.notice_period && formik.errors.notice_period ? (
              <div className={styles.error}>{formik.errors.notice_period}</div>
            ) : null}
          </div>

          <div className={styles.inputField}>
            <label htmlFor='experience'>
              Experience <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className={styles.input}
              type='text'
              name='experience'
              id='experience'
              value={formik.values.experience}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.experience && formik.errors.experience ? (
              <div className={styles.error}>{formik.errors.experience}</div>
            ) : null}
          </div>

          <div
            className={styles.inputField}
            style={{ width: "100%", padding: "0% 5%" }}
          >
            <label
              for='document'
              className={styles.dropContainer}
              id='dropcontainer'
              style={{ color: "#757575" }}
            >
              {" "}
              Resume*
            </label>
            <div className={styles.inputField}>
              <input
                type='file'
                id='document'
                accept='application/pdf'
                required
                name='document'
                className={styles.resumeInput}
                // onChange={handleChange}
                onChange={(e) => {
                  formik.setFieldValue("document", e.target.files[0]);
                }}
                onBlur={formik.handleBlur}
              />
              {formik.errors.document && formik.touched.document ? (
                <span className={styles.errorMsg}>{formik.errors.document}</span>
              ) : null}
            </div>
          </div>

          <div
            className={styles.inputField}
            style={{ width: "100%", padding: "0% 5%" }}
          >
            <label htmlFor='message'>
              Message <span style={{ color: "red" }}>*</span>
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
          Apply
        </button>
        {submitted && (
          <span style={{ color: "green", marginLeft: "5%" }}>
            Sent Successfully!
          </span>
        )}
      </form>
    </div>
  );
}

export default Applyform