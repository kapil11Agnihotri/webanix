"use client";

import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import styles from "../../add/add.module.css";
import { useRouter } from "next/navigation";
import { showErrorToast, showSuccessToast } from "@/utils/toaster";
import { FcImport } from "react-icons/fc";
import Link from "next/link";
import Button from "@/components/Button/Button";

const EditUser = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const [roleData, setRoleData] = useState([]);

  const validationRules = {
    name: Yup.string()
      .max(120, "Name must not exceed 120 characters")
      .required("Name is required"),
    email: Yup.string()
      .matches(
        /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid Email!"
      )
      .required("Email is required"),

    role: Yup.string().required("Role is required"),

    password: Yup.string()
      .max(25, "Password must not exceed 25 characters")
      .required("Password is required")
      .min(8, "Password must be greater or equal 8 characters"),

    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is Required"),
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/admin/roles");
      const res = await response.json();
      setRoleData(res?.data);
    } catch (error) {
      // Handle login error
      showErrorToast("Role fetch error!");
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/admin/users/${id}`);
      const res = await response.json();
      formik.setFieldValue("name", res?.data?.name);
      formik.setFieldValue("email", res?.data?.email);
      formik.setFieldValue("role_id", res?.data?.role_id);
      if (res.code !== 200) {
        showErrorToast(
          res?.data?.message?.issues[0]?.message || "500 | error!"
        );
      }
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchUserData();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role_id: "",
    },
    // validationSchema: Yup.object(validationRules),

    onSubmit: async (values) => {
      const obj={
        name: values.name,
        email: values.email,
        role_id: values.role_id
      }
      if(values.password !==""){
        obj.password = values.password;
      }
      try {
        const response = await fetch(`/api/admin/users/${id}`, {
          method: "PUT",
          body: JSON.stringify(obj),
        });
        const data = await response.json();
        if (data.code === 200) {
          showSuccessToast("User Updated successfully!");
          router.push("/admin/users");
        } else if (data.code !== 200) {
          showErrorToast(
            data?.message?.issues[0]?.message || "User updation  error!"
          );
        }
      } catch (error) {
        // Handle login error
        showErrorToast("User updation error!");
      }
    },
  });

  return (
    <>
      <div className="section-body mt-4">
        <div className="container-fluid">
          <div className="tab-content">
            <div className="d-flex justify-content-start mb-2">
              <Button text="Back" link="admin/users" icon="left" />
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div
                className="tab-pane fade show active"
                id="user-add"
                role="tabpanel"
              >
                <div className="card">
                  <div className="card-header">
                    <h6
                      className="card-title"
                      style={{ fontSize: "18px", fontWeight: "unset" }}
                    >
                      Edit User
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <input
                            id="name"
                            name="name"
                            type="text"
                            className="form-control"
                            placeholder="Name *"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values?.name}
                            style={{ margin: "2%" }}
                          />
                          {formik.touched.name && formik.errors.name ? (
                            <div className={styles.invalidDataError}>
                              {formik.errors.name}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <input
                            id="email"
                            name="email"
                            type="text"
                            className="form-control "
                            placeholder="Email *"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values?.email}
                            style={{ margin: "2%" }}
                          />
                          {formik.touched.email && formik.errors.email ? (
                            <div className={styles.invalidDataError}>
                              {formik.errors.email}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <select
                            className="form-control show-tick"
                            id="role_id"
                            name="role_id"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values?.role_id}
                            style={{ margin: "2%" }}
                          >
                            {/* <option> */}
                            <option value="" disabled selected>
                              Select Role
                            </option>

                            {roleData.map((value, index) => (
                              <option key={index} value={value.id}>
                                {value.name}
                              </option>
                            ))}
                          </select>
                          {formik.touched.role_name &&
                          formik.errors.role_name ? (
                            <div className={styles.invalidDataError}>
                              {formik.errors.role_name}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <input
                            id="password"
                            name="password"
                            type="password"
                            className="form-control"
                            placeholder="Password *"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values?.password}
                            style={{ margin: "2%" }}
                          />
                          {formik.touched.password && formik.errors.password ? (
                            <div className={styles.invalidDataError}>
                              {formik.errors.password}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <input
                            id="confirm_password"
                            name="confirm_password"
                            type="password"
                            className="form-control"
                            placeholder="Confirm Password*"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values?.confirm_password}
                            style={{ margin: "2%" }}
                          />
                          {formik.touched.confirm_password &&
                          formik.errors.confirm_password ? (
                            <div className={styles.invalidDataError}>
                              {formik.errors.confirm_password}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-12 text-end">
                        <hr className="mt-4" />
                        <Link href={`/admin/users`}>
                          <button
                            type="button"
                            id="button_1"
                            className="btn btn-secondary mx-1"
                            data-dismiss="modal"
                          >
                            CLOSE
                          </button>
                        </Link>
                        <button
                          type="submit"
                          id="button_2"
                          className="btn"
                          style={{
                            backgroundColor: "#fe4550",
                            color: "#ffffff",
                          }}
                        >
                          SUBMIT
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUser;
