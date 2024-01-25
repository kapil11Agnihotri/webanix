"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../../services-category.module.css";
import { showErrorToast, showSuccessToast } from "@/utils/toaster";
import { WithContext as ReactTags } from "react-tag-input";
import JoditEditor from "jodit-react";
import Button from "@/components/Button/Button";

const  CategoryEdit = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const [keywords, setKeywords] = useState([]);
  const [ogImage, setogImage] = useState("");
  const [tags, setTags] = useState([]);
  const [featuredImage, setFeaturedImage] = useState("");
  const [showFeaturedImage, setShowFeaturedImage] = useState(false);
  const [showOgImage, setShowOgImage] = useState(false);

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  const handleDeleteKeywords = (i) => {
    setKeywords(keywords.filter((tag, index) => index !== i));
  };

  const handleAdditionKeywords = (keyword) => {
    setKeywords([...keywords, keyword]);
  };

  const handleDragKeywords = (keyword, currPos, newPos) => {
    const newkeywords = keywords.slice();

    newkeywords.splice(currPos, 1);
    newkeywords.splice(newPos, 0, keyword);

    setKeywords(newkeywords);
  };

  const handleDeleteTags = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAdditionTags = (tag) => {
    setTags([...tags, tag]);
  };

  const handleDragTags = (tags, currPos, newPos) => {
    const newtags = tags.slice();

    newtags.splice(currPos, 1);
    newtags.splice(newPos, 0, tags);

    setTags(newtags);
  };

  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  const handleImageChange = (e) => {
    // When a new file is selected, set the imagePreview state and update Formik field value
    const file = e.target.files[0];
    setogImage(URL.createObjectURL(file));
    formik.setFieldValue("og_image", file);
    setShowOgImage(true);
  };

  const handleFeaturedImage = (e) => {
    // When a new file is selected, set the imagePreview state and update Formik field value
    const file = e.target.files[0];
    setFeaturedImage(URL.createObjectURL(file));
    formik.setFieldValue("featured_image", file);
    setShowFeaturedImage(true);
  };
  const validationRules = {
    title: Yup.string().required("category name is required"),
    slug: Yup.string().required("slug is required"),
    featured_image: Yup.string().required("featured image is required"),
    alt: Yup.string().required("alt is required"),
    heading: Yup.string().required("heading is required"),
    content: Yup.string().required("content is required"),
  };

  const initialValues = {
    title: "",
    slug: "",
    featured_image: "",
    alt: "",
    heading: "",
    content: "",
    meta_title: "",
    meta_description: "",
    keywords: [],
    tags: [],
    og_title: "",
    og_description: "",
    og_image: "",
    og_alt: "",
  };

  //using formik here for form data handling and submitting
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object(validationRules),

    onSubmit: async (values) => {
      const object = {
        title: values.title,
        slug: values.slug,
        featured_image: values.featured_image,
        alt: values.alt,
        heading: values.heading,
        content: values.content,
        meta_title: values.meta_title,
        meta_description: values.meta_description,
        keywords: keywords,
        tags: tags,
        og_title: values.og_title,
        og_description: values.og_description,
        og_image: values.og_image,
        og_alt: values.og_alt,
      };
      const formData = new FormData();
      // Appending each key-value pair from the object to the FormData object
      Object.entries(object).forEach(([key, value]) => {
        if (key === "keywords" || key === "tags") {
          // If the key is 'page_json', stringify the value and append it as a JSON string
          formData.append(key, JSON.stringify(value));

        } else {
          // Otherwise, directly append the key-value pair
          formData.append(key, value);
        }
      });
      try {
        const response = await fetch(`/api/admin/categories/${id}`, {
          method: "PUT",
          body: formData,
        }).then(response => response.json());

        if (response.code === 200) {
            showSuccessToast("Category updated successfully!");
            router.push("/admin/service-categories");
          }else if (response.code === 422) {
              showErrorToast(
                   response?.message?.issues[0]?.message
              );
            }else{
              showErrorToast(
                  response?.message ||  "Category updation error!"
              );
            }
      } catch (error) {
        // Handle login error
        showErrorToast("Category updation error!");
      }
    },
  });

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const formattedValue = capitalizeWords(inputValue);

    // Set the formatted value back to the formik.values object
    formik.setFieldValue(e.target.name, formattedValue);
  };

  const capitalizeWords = (inputString) => {
    return inputString.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`).then((res) =>
        res.json()
      );
      const Data = await response.data;
      formik.setValues(Data);
      setKeywords(JSON.parse(Data.keywords));
      setTags(JSON.parse(Data.tags));
      //   setogImage(Data.og_image);
    } catch (error) {
      showErrorToast("Category fetch error!");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div className="section-body mt-4">
        <div className="container-fluid">
          <div className="tab-content">
            <form onSubmit={formik.handleSubmit}>
              <div
                className="tab-pane fade show active"
                id="user-add"
                role="tabpanel"
              >
                <div className="d-flex justify-content-start">
                  <Button
                    text="Back"
                    link="admin/service-categories"
                    icon="left"
                  />
                </div>
                <div className="card">
                  <div className="card-header">
                    <h6
                      className="card-title"
                      style={{ fontSize: "18px", fontWeight: "unset" }}
                    >
                      EDIT CATEGORY
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <input
                            id="title"
                            name="title"
                            type="text"
                            className="form-control"
                            placeholder="Category Name *"
                            onChange={handleInputChange}
                            onBlur={formik.handleBlur}
                            value={formik.values?.title}
                            style={{ margin: "2%" }}
                          />
                          {formik.touched.title && formik.errors.title ? (
                            <div className={styles.invalidDataError}>
                              {formik.errors.title}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <input
                            id="slug"
                            name="slug"
                            type="text"
                            className="form-control "
                            placeholder="Slug *"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values?.slug}
                            style={{ margin: "2%" }}
                          />
                          {formik.touched.slug && formik.errors.slug ? (
                            <div className={styles.invalidDataError}>
                              {formik.errors.slug}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <input
                            id="featured_image"
                            name="featured_image"
                            type="file"
                            accept="image/*"
                            className="form-control "
                            placeholder="Featured Image "
                            onChange={handleFeaturedImage}
                            onBlur={formik.handleBlur}
                            style={{ margin: "2%" }}
                          />
                          {showFeaturedImage ? (
                            typeof featuredImage == "string" &&
                            featuredImage !== "" ? (
                              <Image
                                width={70}
                                height={70}
                                className="mt-2"
                                src={featuredImage}
                                alt="featured image"
                                loading="lazy"
                              />
                            ) : (
                              ""
                            )
                          ) : typeof formik.values?.featured_image == "string" &&
                            formik.values?.featured_image !== "" ? (
                            <Image
                              width={70}
                              height={70}
                              className="mt-2"
                              src={`/media/categories/${formik.values?.featured_image}`}
                              alt="featured image"
                              loading="lazy"
                            />
                          ) : (
                            ""
                          )}

                          {formik.touched.featured_image &&
                          formik.errors.featured_image ? (
                            <div className={styles.invalidDataError}>
                              {formik.errors.featured_image}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <input
                            id="alt"
                            name="alt"
                            type="text"
                            className="form-control"
                            placeholder="Featured Image Alt"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values?.alt}
                            style={{ margin: "2%" }}
                          />
                          {formik.touched.alt && formik.errors.alt ? (
                            <div className={styles.invalidDataError}>
                              {formik.errors.alt}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <input
                            id="heading"
                            name="heading"
                            type="text"
                            className="form-control"
                            placeholder="Heading *"
                            onChange={handleInputChange}
                            onBlur={formik.handleBlur}
                            value={formik.values?.heading}
                            style={{ margin: "2%" }}
                          />
                          {formik.touched.heading && formik.errors.heading ? (
                            <div className={styles.invalidDataError}>
                              {formik.errors.heading}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <JoditEditor
                            id="content"
                            name="content"
                            className="form-control"
                            placeholder="Content*"
                            onChange={(e) => formik.setFieldValue("content", e)}
                            onBlur={formik.handleBlur}
                            value={formik.values?.content}
                            style={{ margin: "2%" }}
                          />
                          {formik.touched.content && formik.errors.content ? (
                            <div className={styles.invalidDataError}>
                              {formik.errors.content}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* meta field */}

                      <div className="row">
                        {/* <h3 style={{ margin: "1%" }}>Meta Fields:</h3> */}
                        <div className="col-md-6 col-sm-12">
                          <div className="">
                            <input
                              id="meta_title"
                              name="meta_title"
                              type="text"
                              className="form-control"
                              placeholder="meta title *"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values?.meta_title}
                              style={{ margin: "2%" }}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <div className="">
                            <input
                              id="meta_description"
                              name="meta_description"
                              type="text"
                              className="form-control"
                              placeholder="meta description"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values?.meta_description}
                              style={{ margin: "2%" }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div
                          className="col-md-12 col-sm-12"
                          style={{ marginLeft: "1%" }}
                        >
                          <h5 style={{ marginTop: "1%" }}>Keywords:</h5>
                          <ReactTags
                            tags={keywords}
                            id="keywords"
                            name="keywords"
                            autofocus={false}
                            delimiters={delimiters}
                            handleDelete={handleDeleteKeywords}
                            handleAddition={handleAdditionKeywords}
                            handleDrag={handleDragKeywords}
                            inputFieldPosition="bottom"
                            autocomplete
                            handleInputChange={formik.handleChange}
                            handleInputBlur={formik.handleBlur}
                            value={formik.values?.keywords}
                            placeholder="Enter keywords"
                          />
                        </div>
                        <div
                          className="col-md-12 col-sm-12 "
                          style={{ marginLeft: "1%" }}
                        >
                          <h5 style={{ marginTop: "1%" }}>Tags:</h5>
                          <ReactTags
                            tags={tags}
                            id="tags"
                            name="tags"
                            autofocus={false}
                            delimiters={delimiters}
                            handleDelete={handleDeleteTags}
                            handleAddition={handleAdditionTags}
                            handleDrag={handleDragTags}
                            inputFieldPosition="bottom"
                            autocomplete
                            handleInputChange={formik.handleChange}
                            handleInputBlur={formik.handleBlur}
                            value={formik.values?.tags}
                            placeholder="Enter tags"
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 col-sm-12">
                          <div className="">
                            <input
                              id="og_title"
                              name="og_title"
                              type="text"
                              className="form-control"
                              placeholder="Og title"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values?.og_title}
                              style={{ margin: "2%" }}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <div className="">
                            <input
                              id="og_description"
                              name="og_description"
                              type="text"
                              className="form-control"
                              placeholder="Og description"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values?.og_description}
                              style={{ margin: "2%" }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 col-sm-12">
                          <div className="">
                            <input
                              id="og_image"
                              name="og_image"
                              type="file"
                              className="form-control"
                              placeholder="Og Image"
                              onChange={(e) => handleImageChange(e)}
                              accept="image/*"
                              onBlur={formik.handleBlur}
                              style={{ margin: "2%" }}
                            />
                            {showOgImage ? (
                              typeof ogImage == "string" && ogImage !== "" ? (
                                <Image
                                  width={70}
                                  height={70}
                                  className="mt-2"
                                  src={ogImage}
                                  alt="og image"
                                  loading="lazy"
                                />
                              ) : (
                                ""
                              )
                            ) : typeof formik.values?.og_image == "string" &&
                              formik.values?.og_image !== "" ? (
                              <Image
                                width={70}
                                height={70}
                                className="mt-2"
                                src={`/media/categories/${formik.values?.og_image}`}
                                alt="og image"
                                loading="lazy"
                              />
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <div className="">
                            <input
                              id="og_alt"
                              name="og_alt"
                              type="text"
                              className="form-control"
                              placeholder="Og alt"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values?.og_alt}
                              style={{ margin: "2%" }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-12 text-end">
                        <hr className="mt-4" />

                        <button
                          type="button"
                          id="service_categories_edit_close_button"
                          className="btn btn-secondary mx-1"
                          data-dismiss="modal"
                          onClick={() => {
                            router.push("/admin/service-categories");
                          }}
                        >
                          CLOSE
                        </button>

                        <button
                          type="submit"
                          id="service_categories_edit_submit_button"
                          className="btn"
                          style={{
                            backgroundColor: "#fe4550",
                            color: "#ffffff",
                          }}
                        >
                          UPDATE
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

export default  CategoryEdit;
