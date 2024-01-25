"use client";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import JoditEditor from "jodit-react";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import classes from "../../users/add/add.module.css";
import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";
import { showErrorToast, showSuccessToast } from "@/utils/toaster";
import { WithContext as ReactTags } from "react-tag-input";
import Image from "next/image";
import Link from "next/link";

const AddBlog = () => {
  const [featuredImage, setFeaturedImage] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [blogType, setBlogType] = useState([]);
  const router = useRouter();
  const [keywords, setKeywords] = useState([]);
  const [tags, setTags] = useState([]);
  const [blog_tags, setBlogTags] = useState([]);

  // Key codes for delimiters
  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  // Validation rules for formik(add)
  const validationRules = {
    slug: Yup.string().required("Slug is required"),
    title: Yup.string().required("Title is required"),
  };

  // Handles deletion of keywords
  const handleDeleteKeywords = (i) => {
    setKeywords(keywords.filter((tag, index) => index !== i));
  };
  // Handles addition of keywords
  const handleAdditionKeywords = (keyword) => {
    setKeywords([...keywords, keyword]);
  };

  // Handles deletion of tags
  const handleDeleteTags = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };
  // Handles addition of tags
  const handleAdditionTags = (tag) => {
    setTags([...tags, tag]);
  };

  // Handles deletion of blog tags
  const handleDeleteBlogTags = (i) => {
    setBlogTags(blog_tags.filter((tag, index) => index !== i));
  };

  // Handles addition of blog tags
  const handleAdditionBlogTags = (blogTag) => {
    setBlogTags([...blog_tags, blogTag]);
  };

  // Delimiters for ReactTags component
  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  // Handles image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue(e.target.name, file);
    if (e.target.name === "og_image") {
      setOgImage(URL.createObjectURL(file));
    } else if (e.target.name === "featured_image") {
      setFeaturedImage(URL.createObjectURL(file));
    }
  };

  // Initialize formik with initial values, validation schema, and submit function
  const formik = useFormik({
    initialValues: {
      slug: "",
      title: "",
      description: "",
      short_description: "",
      featured_image: "",
      alt: "",
      blog_tags: [],
      meta_title: "",
      meta_description: "",
      keywords: [],
      structured_data: "",
      tags: [],
      og_title: "",
      og_description: "",
      og_image: "",
      og_alt: "",
      blog_type: "",
      status: "",
      publish_date: "",
    },
    validationSchema: Yup.object(validationRules),

    onSubmit: async (values) => {
      const formData = new FormData();

      const object = {
        slug: values.slug,
        title: values.title,
        description: values.description,
        short_description: values.short_description,
        featured_image: values.featured_image,
        alt: values.alt,
        blog_tags: blog_tags,
        meta_title: values.meta_title,
        meta_description: values.meta_description,
        keywords: keywords,
        structured_data: values.structured_data,
        tags: tags,
        og_title: values.og_title,
        og_description: values.og_description,
        og_image: values.og_image,
        og_alt: values.og_alt,
        blog_type: values.blog_type,
        status: values.status,
        publish_date: values.publish_date,
      };

      // Appending each key-value pair from the object to the FormData object
      Object.entries(object).forEach(([key, value]) => {
        if (key === "keywords" || key === "tags" || key === "blog_tags") {
          // If the key is 'keywords' or 'tags', stringify the value and append it as a JSON string
          formData.append(key, JSON.stringify(value));
        } else {
          // For other keys like 'title', 'description' etc directly append the key-value pair
          formData.append(key, value);
        }
      });

      // Handle form submission
      try {
        const response = await fetch("/api/admin/blogs", {
          method: "POST",
          body: formData,
        });
        // Handle success
        const data = await response.json();

        if (data.code === 201) {
          showSuccessToast("New Blog created successfully!");
          router.push("/admin/blogs");
        } else {
          // Handle error
          showErrorToast(
            data?.message?.issues[0]?.message || "Blog Creation error!"
          );
        }
      } catch (error) {
        // Handle login error
        showErrorToast("Blog creation error!");
      }
    },
  });

  // Fetch blog types data
  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/blog-types").then((res) =>
        res.json()
      );
      setBlogType(response?.data);
    } catch (error) {
      // Handle login error
      showErrorToast("Blog Category fetch error!");
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
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
              <div className="d-flex justify-content-start">
                <Button text="Back" link="admin/blogs" icon="left" />
              </div>
              <div className="card mt-3">
                <div className="card-header">
                  <strong
                    className="card-title"
                    style={{ fontSize: "18px", fontWeight: "unset" }}
                  >
                    ADD BLOG
                  </strong>
                </div>
                <div className="card-body">
                  <div className="row clearfix">
                    <div className="col-md-6 col-md-6 col-sm-12 mt-3">
                      <div className="form-group">
                        {/* Title */}
                        <input
                          id="title"
                          name="title"
                          type="text"
                          className="form-control"
                          placeholder="Blog Title"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.title}
                        />
                        {/* Title Error Message */}
                        {formik.touched.title && formik.errors.title ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.title}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-md-6 col-md-6 col-sm-12 mt-3">
                      <div className="form-group">
                        {/* Slug */}
                        <input
                          id="slug"
                          name="slug"
                          type="text"
                          className="form-control"
                          placeholder="Slug"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.slug}
                        />
                        {/* Slug Error Message */}
                        {formik.touched.slug && formik.errors.slug ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.slug}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-12 mt-3">
                      <div className="form-group">
                        {/* Blog Category Select */}
                        <select
                          className="form-control show-tick"
                          id="blog_type"
                          name="blog_type"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.blog_type}
                        >
                          {/* <option> */}
                          <option>Select Blog Category</option>

                          {blogType.map((value, index) => (
                            <option key={index} value={value.id}>
                              {value.name}
                            </option>
                          ))}
                        </select>
                        {/* Blog Category Error Message */}
                        {formik.touched.blog_type && formik.errors.blog_type ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.blog_type}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-12 mt-3">
                      <div className="form-group">
                        {/* Status */}
                        <select
                          id="status"
                          name="status"
                          className="form-control"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.status}
                        >
                          <option value="">Select Status</option>
                          <option value="0">Draft</option>
                          <option value="1">Published</option>
                        </select>
                        {/* Status Error Message */}
                        {formik.touched.status && formik.errors.status ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.status}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12 mt-3 col-sm-12">
                      <div className="form-group">
                        {/* Short Description */}
                        <textarea
                          id="short_description"
                          name="short_description"
                          type="text"
                          className="form-control"
                          placeholder="Short Description"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.short_description}
                        />
                        {/* Short Description Error Message */}
                        {formik.touched.short_description &&
                        formik.errors.short_description ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.short_description}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12 mt-3 col-sm-12">
                      <div className="form-group">
                        {/* Description */}
                        <JoditEditor
                          id="description"
                          name="description"
                          type="text"
                          className="form-control"
                          placeholder="Description"
                          onChange={(newContent) =>
                            formik.setFieldValue("description", newContent)
                          }
                          onBlur={formik.handleBlur}
                          value={formik.values.description}
                        />
                        {/* Description Error Message */}
                        {formik.touched.description &&
                        formik.errors.description ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.description}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-md-6 mt-2 col-sm-12 mt-3">
                      <div className="form-group">
                        {/* Meta Title Name */}
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
                        {/* Meta Title Error Message */}
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
                        {/* Structured Data Error Message */}
                        {formik.touched.structured_data &&
                        formik.errors.structured_data ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.structured_data}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
                    <div className="form-group">
                      {/* Blog Tags */}
                      <ReactTags
                        tags={blog_tags}
                        id="blog_tags"
                        name="blog_tags"
                        autofocus={false}
                        delimiters={delimiters}
                        handleDelete={handleDeleteBlogTags}
                        handleAddition={handleAdditionBlogTags}
                        inputFieldPosition="bottom"
                        autocomplete
                        handleInputChange={formik.handleChange}
                        handleInputBlur={formik.handleBlur}
                        value={formik.values.blog_tags}
                        placeholder="Enter Blog Tags"
                      />
                    </div>
                  </div>
                    <div className="col-lg-5 col-md-5 col-sm-12 mt-3">
                    <div className="form-group">
                      {/* Date */}
                      <input
                        id="publish_date"
                        name="publish_date"
                        type="date"
                        className="form-control"
                        placeholder="Publish Date"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.publish_date}
                        
                      />
                      {/* Date Error Message */}
                      {formik.touched.publish_date && formik.errors.publish_date ? (
                        <div className={classes.invalidDataError}>
                          {formik.errors.publish_date}
                        </div>
                      ) : null}  
                  </div>
                  </div>

                    <div className="col-md-6 col-sm-12 mt-4">
                      <div className="form-group">
                        {/* Featured Image */}
                        <h6>Featured Image</h6>
                        <input
                          id="featured_image"
                          name="featured_image"
                          type="file"
                          accept="image/*"
                          className="form-control "
                          placeholder="Featured Image "
                          onChange={handleImageChange}
                          onBlur={formik.handleBlur}
                        />
                        {/* Featured Image Input */}
                        {typeof featuredImage == "string" &&
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
                        )}
                        {/* Featured Error Message */}
                        {formik.touched.featured_image &&
                        formik.errors.featured_image ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.featured_image}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-12 mt-5">
                      <div className="form-group">
                      {/* <h6>Featured Alt</h6> */}
                        {/* Featured Alt */}
                        <input
                          id="alt"
                          name="alt"
                          type="text"
                          className="form-control"
                          placeholder="Featured Alt"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.alt}
                        />
                        {/* Featured Alt Error Message */}
                        {formik.touched.alt && formik.errors.alt ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.alt}
                          </div>
                        ) : null}
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
                        {/* Meta Description Error Message */}
                        {formik.touched.meta_description &&
                        formik.errors.meta_description ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.meta_description}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="row">
                      <div className=" col -lg-6 col-md-6 col-sm-12 mt-3" >
                        {/* Keywords */}
                        <ReactTags
                          tags={keywords}
                          id="keywords"
                          name="keywords"
                          autofocus={false}
                          delimiters={delimiters}
                          handleDelete={handleDeleteKeywords}
                          handleAddition={handleAdditionKeywords}
                          inputFieldPosition="bottom"
                          autocomplete={true}
                          handleInputChange={formik.handleChange}
                          handleInputBlur={formik.handleBlur}
                          value={formik.values.keywords}
                          placeholder="Enter keywords"
                        />
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
                        {/* Tags */}
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
                        {/* Og Title Error Message */}
                        {formik.touched.og_title && formik.errors.og_title ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.og_title}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 col-sm-12 mt-3">
                        <div className="">
                          {/* Og Image */}
                          <input
                            id="og_image"
                            name="og_image"
                            type="file"
                            className="form-control"
                            placeholder="Og Image"
                            onChange={handleImageChange}
                            accept="image/*"
                            onBlur={formik.handleBlur}
                          />
                          {/* Og Image Error input  */}
                          {typeof ogImage == "string" && ogImage !== "" ? (
                            <Image
                              width={70}
                              height={70}
                              className="mt-2"
                              src={ogImage}
                              alt="featured image"
                              loading="lazy"
                            />
                          ) : (
                            ""
                          )}
                          {/* Og Image Error Message */}
                          {formik.touched.og_image && formik.errors.og_image ? (
                            <div className={classes.invalidDataError}>
                              {formik.errors.og_image}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-md-6 col-sm-12 mt-3">
                        <div className="form-group">
                          {/* Og Alt */}
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
                          {/* Og Alt Error Message */}
                          {formik.touched.og_alt && formik.errors.og_alt ? (
                            <div className={classes.invalidDataError}>
                              {formik.errors.og_alt}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-lg-12 col-sm-12 mt-3">
                        <div className="form-group">
                          {/* Og Description */}
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
                          {/* Og Description Error Message */}
                          {formik.touched.og_description &&
                          formik.errors.og_description ? (
                            <div className={classes.invalidDataError}>
                              {formik.errors.og_description}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-12 submit-btn  text-end">
                        <Link href={`/admin/blogs`}>
                          {/* Close Button */}
                          <button
                            type="button"
                            id="button_1"
                            className="btn btn-secondary mx-1 mt-3"
                            data-dismiss="modal"
                          >
                            CLOSE
                          </button>
                        </Link>
                        {/* Submit Button */}
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;
