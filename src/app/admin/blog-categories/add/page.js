"use client";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import classes from "../../users/add/add.module.css";
import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";
import { showErrorToast, showSuccessToast } from "@/utils/toaster";
import Link from "next/link";
import { WithContext as ReactTags } from "react-tag-input";
// AddBlogType component represents a form for adding a blog type
const AddBlogType = () => {
  const [og_image, setOgImage] = useState("");
  const router = useRouter();
  const [keywords, setKeywords] = useState([]);
  const [tags, setTags] = useState([]);

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };
  // Validation rules for the form
  const validationRules = {
    name: Yup.string().required("Name is required"),
  };
  // Handler for deleting a keyword from the keywords array
  const handleDeleteKeywords = (i) => {
    setKeywords(keywords.filter((tag, index) => index !== i));
  };
  // Handler for adding a keyword to the keywords array
  const handleAdditionKeywords = (keyword) => {
    setKeywords([...keywords, keyword]);
  };
  // Handler for deleting a tag from the tags array
  const handleDeleteTags = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };
  // Handler for adding a tag to the tags array
  const handleAdditionTags = (tag) => {
    setTags([...tags, tag]);
  };
  const delimiters = [KeyCodes.comma, KeyCodes.enter];
  // Handler for changing the image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue(e.target.name, file);
    if (e.target.name === "og_image") {
      setOgImage(URL.createObjectURL(file));
    } else {
      setOgImage("");
    }
  };
  // Formik form for handling form state, validation, and submission
  const formik = useFormik({
    initialValues: {
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
    },
    validationSchema: Yup.object(validationRules),

    onSubmit: async (values) => {
      const formData = new FormData();
      const object = {
        name: values.name, // Name field value
        meta_title: values.meta_title,
        meta_description: values.meta_description,
        keywords: keywords, // Keywords array
        structured_data: values.structured_data,
        tags: tags, // Tags array
        og_title: values.og_title,
        og_description: values.og_description,
        og_image: values.og_image,
        og_alt: values.og_alt,
      };
      // Appending each key-value pair from the object to the FormData object
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
        const response = await fetch("/api/admin/blog-types", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.code === 201) {
          // Show success toast if the blog category is created successfully
          showSuccessToast("New Blog Category created successfully!");
          router.push("/admin/blog-categories");
        } else if (data.code === 422) {
          // Show error toast with the first issue message if there is a validation error
          showErrorToast(
            data?.message?.issues[0]?.message || "Blog Category creation error!"
          );
        } else {
          // Show error toast with the general error message
          showErrorToast(data?.message);
        }
      } catch (error) {
        // Handle blog creation error
        showErrorToast("Blog creation error!");
      }
    },
  });
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
              <div className="card mt-3">
                <div className="card-header">
                  {/* Card title */}
                  <strong
                    className="card-title"
                    style={{ fontSize: "18px", fontWeight: "unset" }}
                  >
                    ADD BLOG CATEGORY
                  </strong>
                </div>
                <div className="card-body">
                  <div className="row clearfix">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      {/* Blog Type Name input */}
                      <div className="form-group">
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
                        {/* Display error message if name field is touched and has an error */}
                        {formik.touched.name && formik.errors.name ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.name}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-md-6 mt-2 col-sm-12 mt-3">
                      {/* Meta Title Name input */}
                      <div className="form-group">
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
                        {/* Display error message if meta_title field is touched and has an error */}
                        {formik.touched.meta_title &&
                        formik.errors.meta_title ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.meta_title}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-12 mt-3">
                      {/* Structured Data input */}
                      <div className="form-group">
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
                        {/* Display error message if structured_data field is touched and has an error */}
                        {formik.touched.structured_data &&
                        formik.errors.structured_data ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.structured_data}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    
                    <div className="row">
                      {/* Keywords */}
                      <div className="col-md-6 col-sm-12 mt-3" style={{ marginLeft: "1%" }}>
                        <h5>Keywords:</h5>
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
                    
                      {/* Tags */}
                      <div className="col-md-5 col-sm-12 mt-3" style={{ marginLeft: "1%" }}>
                        <h5>Tags:</h5>
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
                    
                    {/* Meta Description */}
                    <div className="col-lg-12 col-sm-12 mt-3">
                      <div className="form-group">
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
                        {/* Error handling for meta_description */}
                        {formik.touched.meta_description && formik.errors.meta_description ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.meta_description}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    
                    {/* Og Title */}
                    <div className="col-lg-12 col-sm-12 mt-3">
                      <div className="form-group">
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
                        {/* Error handling for og_title */}
                        {formik.touched.og_title && formik.errors.og_title ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.og_title}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    
                    {/* Og Image */}
                    <div className="col-md-6 col-sm-12 mt-3">
                      <div className="form-group">
                        <input
                          id="og_image"
                          name="og_image"
                          type="file"
                          className="form-control"
                          placeholder="Og Image"
                          onChange={(e) => handleImageChange(e)}
                          onBlur={formik.handleBlur}
                          accept="image/*"
                          // value={formik.values.og_image}
                        />
                        {/* Error handling for og_image */}
                        {typeof og_image == "string" && og_image !== "" ? (
                          <Image
                            width={70}
                            height={70}
                            className="mt-2"
                            src={og_image}
                            alt="client logo"
                            loading="lazy"
                          />
                        ) : (
                          ""
                        )}
                        {formik.touched.og_image && formik.errors.og_image ? (
                          <div className={styles.invalidDataError}>
                            {formik.errors.og_image}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Og Alt */}

                    <div className="col-md-6 col-sm-12 mt-3">
                      <div className="form-group">
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
                        {/* Error handling for og_alt */}
                        {formik.touched.og_alt && formik.errors.og_alt ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.og_alt}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Og Description */}
                    <div className="col-lg-12 col-sm-12 mt-3">
                      <div className="form-group">
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
                        {/* Error handling for og_description */}
                        {formik.touched.og_description &&
                        formik.errors.og_description ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.og_description}
                          </div>
                        ) : null}
                      </div>
                    </div>
                      
                    <div className="col-12 submit-btn  text-end">
                      <Link href={`/admin/blog-categories`}>
                        <button
                          type="button"
                          id="button_1"
                          className="btn btn-secondary mx-1 mt-3"
                          data-dismiss="modal"
                        >
                          CLOSE
                        </button>
                      </Link>

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
