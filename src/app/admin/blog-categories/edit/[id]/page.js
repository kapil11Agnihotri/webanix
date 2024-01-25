"use client";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import classes from "../../../users/add/add.module.css";
import Button from "@/components/Button/Button";
import { showErrorToast, showSuccessToast } from "@/utils/toaster";
import Link from "next/link";
import Image from "next/image";
import { WithContext as ReactTags } from "react-tag-input";
// Component for adding/editing a blog category
const AddBlogType = ({ params }) => {
  const [og_image, setOgImage] = useState("");
  const [showOgImage, setShowOgImage] = useState(false);
  const { id } = params;
  const router = useRouter();
  const [keywords, setKeywords] = useState([]);
  const [tags, setTags] = useState([]);
  // Validation schema for formik
  const validationRules = {
    name: Yup.string().required("Name is required"),
  };
  // Constants for key codes
  const KeyCodes = {
    comma: 188,
    enter: 13,
  };
  // Delete a keyword from the keywords array
  const handleDeleteKeywords = (i) => {
    setKeywords(keywords.filter((tag, index) => index !== i));
  };
  // Add a keyword to the keywords array
  const handleAdditionKeywords = (keyword) => {
    setKeywords([...keywords, keyword]);
  };
  // Delete a tag from the tags array
  const handleDeleteTags = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };
  // Add a tag to the tags array
  const handleAdditionTags = (tag) => {
    setTags([...tags, tag]);
  };
  // Delimiters for keyword and tag input
  const delimiters = [KeyCodes.comma, KeyCodes.enter];
  // Fetch blog category data for editing
  const fetchBlogCategoryData = async () => {
    try {
      const response = await fetch(`/api/admin/blog-types/${id}`);
      const res = await response.json();
      formik.setFieldValue("name", res?.data?.name);
      formik.setFieldValue("meta_title", res?.data?.meta_title);
      formik.setFieldValue("meta_description", res?.data?.meta_description);
      formik.setFieldValue("keywords", res?.data?.keywords);
      formik.setFieldValue("structured_data", res?.data?.structured_data);
      formik.setFieldValue("tags", res?.data?.tags);
      formik.setFieldValue("og_title", res?.data?.og_title);
      formik.setFieldValue("og_description", res?.data?.og_description);
      formik.setFieldValue("og_image", res?.data?.og_image);
      formik.setFieldValue("og_alt", res?.data?.og_alt);

      if (res.code !== 200) {
        showErrorToast(
          res?.data?.message?.issues[0]?.message || "500 | error!"
        );
      }
    } catch (error) {
      showErrorToast(error.message);
    }
  };
  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue(e.target.name, file);
    if (e.target.name === "og_image") {
      setOgImage(URL.createObjectURL(file));
      setShowOgImage(true);
    }
  };
  // Initial form values
  const initialValues = {
    name: "",
    meta_title: "",
    meta_description: "",
    keywords: [],
    structured_data: "",
    tags: [],
    og_title: "",
    og_description: "",
    og_image: "",
    og_alt: "",
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object(validationRules),

    onSubmit: async (values) => {
      // Create an object with the desired properties and their default values
      const object = {
        name: values?.name || "",
        meta_title: values?.meta_title || "",
        meta_description: values?.meta_description || "",
        keywords: keywords,
        structured_data: values?.structured_data,
        tags: tags,
        og_title: values?.og_title || "",
        og_description: values?.og_description || "",
        og_image: values?.og_image || "",
        og_alt: values?.og_alt || "",
      };
      // Create a new FormData instance
      const formData = new FormData();

      // Iterate over the values object and append key-value pairs to the formData
      Object.entries(values).forEach(([key, value]) => {
        if (key === "keywords" || key === "tags") {
          // If the key is 'keywords' or 'tags', stringify the value and append it as a JSON string
          formData.append(key, JSON.stringify(value));
        } else {
          // For other keys like 'title', 'description' etc directly append the key-value pair
          formData.append(key, value);
        }
      });

      try {
        // Send a PUT request to the specified API endpoint with the formData as the request body
        const response = await fetch(`/api/admin/blog-types/${id}`, {
          method: "PUT",
          body: formData,
        });

        const data = await response.json();

        if (data.code === 200) {
          showSuccessToast("Blog Category Updated successfully!");
          router.push("/admin/blog-categories");
        } else if (data.code !== 201) {
          showErrorToast(
            data?.message?.issues[0]?.message || "Blog Category Edit Error!"
          );
        } else {
          showErrorToast(data?.message);
        }
      } catch (error) {
        // Handle login error
        showErrorToast("Blog Category Edit Error!");
      }
    },
  });

  useEffect(() => {
    fetchBlogCategoryData();
  }, []);

  return (
    <div className="section-body">
      <div className="container-fluid">
        <div className="tab-content mt-3">
          <form onSubmit={formik.handleSubmit}>
            <div
              className="tab-pane fade show active"
              id="user-add"
              role="tabpanel"
            >
              {/* Back button */}
              <div className="d-flex justify-content-start">
                <Button text="Back" link="admin/blog-categories" icon="left" />
              </div>
              {/* Card */}
              <div className="card mt-2">
                {/* Card Header */}
                <div className="card-header">
                  <strong
                    className="card-title"
                    style={{ fontSize: "18px", fontWeight: "unset" }}
                  >
                    EDIT BLOG CATEGORY
                  </strong>
                </div>
                {/* Card Body */}
                <div className="card-body">
                  <div className="row clearfix">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      {/* Form Group */}
                      <div className="form-group">
                        {/* Input Field */}
                        <input
                          id="name"
                          name="name"
                          type="text"
                          className="form-control"
                          placeholder="Blog Type Name"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.name}
                        />

                        {formik.touched.name && formik.errors.name ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.name}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-md-6 mt-2 col-sm-12 mt-3">
                      <div className="form-group">
                        {/* Meta Title */}
                        <input
                          id="meta_title"
                          name="meta_title"
                          type="text"
                          className="form-control"
                          placeholder="Meta Title Name"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.meta_title}
                        />
                        {/* Display error message for meta_title */}
                        {formik.touched.meta_title &&
                        formik.errors.meta_title ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.meta_title}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-12 mt-3">
                      <div className="form-group">
                        {/* Structured Data */}
                        <input
                          id="structured_data"
                          name="structured_data"
                          type="text"
                          className="form-control"
                          placeholder="Structured Data"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.structured_data}
                        />
                        {/* Display error message for structured_data */}
                        {formik.touched.structured_data &&
                        formik.errors.structured_data ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.structured_data}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="row">
                      <div
                        className="col-md-6 col-sm-12 mt-3"
                        style={{ marginLeft: "1%" }}
                      >
                        <h5>Keywords:</h5>
                        {/* ReactTags component for handling keywords */}
                        <ReactTags
                          tags={keywords}
                          id="keywords"
                          name="keywords"
                          autofocus={false}
                          delimiters={delimiters}
                          handleDelete={handleDeleteKeywords}
                          handleAddition={handleAdditionKeywords}
                          inputFieldPosition="bottom"
                          autocomplete
                          handleInputChange={formik.handleChange}
                          handleInputBlur={formik.handleBlur}
                          value={formik.values.keywords}
                          placeholder="Enter keywords"
                        />
                      </div>

                      <div
                        className="col-md-5 col-sm-12 mt-3"
                        style={{ marginLeft: "1%" }}
                      >
                        <h5>Tags:</h5>
                        {/* ReactTags component for handling tags */}
                        <ReactTags
                          tags={tags}
                          id="tags"
                          name="tags"
                          autofocus={false}
                          delimiters={delimiters}
                          handleDelete={handleDeleteTags}
                          handleAddition={handleAdditionTags}
                          inputFieldPosition="bottom"
                          autocomplete
                          handleInputChange={formik.handleChange}
                          handleInputBlur={formik.handleBlur}
                          value={formik.values.tags}
                          placeholder="Enter tags"
                        />
                      </div>
                    </div>

                    <div className="col-lg-12 col-sm-12 mt-3">
                      <div className="form-group">
                        {/* Meta Description */}
                        <textarea
                          id="meta_description"
                          name="meta_description"
                          type="text"
                          className="form-control"
                          placeholder="Meta Description"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.meta_description}
                        />
                        {/* Display error message for meta_description */}
                        {formik.touched.meta_description &&
                        formik.errors.meta_description ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.meta_description}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-lg-12 col-sm-12 mt-3">
                      <div className="form-group">
                        {/* Og Title */}
                        <input
                          id="og_title"
                          name="og_title"
                          type="text"
                          className="form-control "
                          placeholder="Og Title"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.og_title}
                        />
                        {/* Display error message if og_title is touched and has an error */}
                        {formik.touched.og_title && formik.errors.og_title ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.og_title}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-12 mt-3">
                      <div className="form-group">
                        {/* Input field for og_image */}
                        <input
                          id="og_image"
                          name="og_image"
                          type="file"
                          className="form-control"
                          placeholder="Og Image"
                          onChange={(e) => handleImageChange(e)}
                          onBlur={formik.handleBlur}
                          accept="image/*"
                        />
                        {/* Display og_image if it's available */}
                        {showOgImage ? (
                          typeof og_image == "string" && og_image !== "" ? (
                            <Image
                              width={70}
                              height={70}
                              className="mt-2"
                              src={og_image}
                              alt="og image"
                              loading="lazy"
                            />
                          ) : (
                            ""
                          )
                        ) : typeof formik?.values?.og_image == "string" &&
                          formik?.values?.og_image !== "" ? (
                          <Image
                            width={70}
                            height={70}
                            className="mt-2"
                            src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/blogTypes/${formik?.values?.og_image}`}
                            alt="og image"
                            loading="lazy"
                          />
                        ) : (
                          ""
                        )}
                        {/* Display error message if og_image is touched and has an error */}
                        {formik.touched.og_image && formik.errors.og_image ? (
                          <div className={styles.invalidDataError}>
                            {formik.errors.og_image}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-12 mt-3">
                      <div className="form-group">
                        {/* Input field for og_alt */}
                        <input
                          id="og_alt"
                          name="og_alt"
                          type="text"
                          className="form-control"
                          placeholder="Og Alt"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.og_alt}
                        />
                        {/* Display error message if og_alt is touched and has an error */}
                        {formik.touched.og_alt && formik.errors.og_alt ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.og_alt}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-lg-12 col-sm-12 mt-3">
                      <div className="form-group">
                        {/* Textarea field for og_description */}
                        <textarea
                          id="og_description"
                          name="og_description"
                          type="text"
                          className="form-control"
                          placeholder="Og Description"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.og_description}
                        />
                        {/* Display error message if og_description is touched and has an error */}
                        {formik.touched.og_description &&
                        formik.errors.og_description ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.og_description}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    
                    <div className="col-12 submit-btn  text-end">
                      {/* Close button */}
                      <Link href="/admin/blog-categories">
                        <button
                          type="button"
                          id="button_1"
                          className="btn btn-secondary mx-1 mt-3"
                          data-dismiss="modal"
                        >
                          CLOSE
                        </button>
                      </Link>
                      {/* Submit button */}
                      <button
                        type="submit"
                        id="button_2"
                        className="btn mt-3"
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
  );
};

export default AddBlogType;
