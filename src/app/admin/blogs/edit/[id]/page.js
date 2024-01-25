"use client";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import classes from "../../../users/add/add.module.css";
import Button from "@/components/Button/Button";
import { showErrorToast, showSuccessToast } from "@/utils/toaster";
import Link from "next/link";
import Image from "next/image";
import { WithContext as ReactTags } from "react-tag-input";
const EditBlog = ({ params }) => {
  const [featuredImage, setFeaturedImage] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [showFeaturedImage, setShowFeaturedImage] = useState(false);
  const [showOgImage, setShowOgImage] = useState(false);
  const [blogType, setBlogType] = useState([]);
  const { id } = params;
  const router = useRouter();
  const [keywords, setKeywords] = useState([]);
  const [tags, setTags] = useState([]);
  const [blog_tags, setBlogTags] = useState([]);
  // const [publish_date,setPublishDate] = useState([]);

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  // formik(add)
  const validationRules = {
    slug: Yup.string().required("Slug is required"),
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    short_description: Yup.string().required("Short Description is required"),
    blog_tags: Yup.string().required("Blog Tags is required"),
    blog_type: Yup.string().required("Blog Type is required"),
  };

  const fetchBlogsData = async () => {
    try {
        {/* Fetching blog data from API */ } 
      const response = await fetch(`/api/admin/blogs/${id}`);
      // Parsing the response as JSON
     
      const res = await response.json();
      formik.setValues(res?.data);
 
      if (res.code !== 200) {
        showErrorToast(
          // Showing error toast if response code is not 200
          res?.data?.message?.issues[0]?.message || "500 | error!"
          );
          // Showing error toast for any other error
      }
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  // Delete a keyword at index i from the keywords array
  const handleDeleteKeywords = (i) => {
    setKeywords(keywords?.filter((tag, index) => index !== i));
  };

  // Add a new keyword to the keywords array
  const handleAdditionKeywords = (keyword) => {
    // formik.setFieldValue("keywords", [...formik.values.keywords, keyword]);
    setKeywords([...keywords, keyword]);
  };

  // Delete a tag at index i from the tags array
  const handleDeleteTags = (i) => {
    setTags(tags?.filter((tag, index) => index !== i));
  };

  // Add a new tag to the tags array
  const handleAdditionTags = (tag) => {
    // formik.setFieldValue("tags", [...formik.values.tags, tag]);
    setTags([...tags, tag]);
  };

  // Delete a blog tag at index i from the blogTags array
  const handleDeleteBlogTags = (i) => {
    setBlogTags(blog_tags?.filter((tag, index) => index !== i));
  };

  // Add a new blog tag to the blogTags array
  const handleAdditionBlogTags = (blogTag) => {
    // formik.setFieldValue("blog_tags", [...formik.values.blog_tags, blogTag]);
    setBlogTags([...blog_tags, blogTag]);
  };

  // Key codes for delimiters
  const delimiters = [KeyCodes.comma, KeyCodes.enter];
  // Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue(e.target.name, file);
    if (e.target.name === "og_image") {
      setOgImage(URL.createObjectURL(file));
      setShowOgImage(true);
    } else if (e.target.name === "featured_image") {
      setFeaturedImage(URL.createObjectURL(file));
      setShowFeaturedImage(true);
    }
  };

  const formik = useFormik({
    initialValues: {
      slug: "",
      title: "",
      description: "",
      short_description: "",
      featured_image: "",
      alt: "",
      blog_tags: blog_tags,
      meta_title: "",
      meta_description: "",
      keywords: keywords,
      structured_data: "",
      tags: tags,
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

      Object.entries(values).forEach(([key, value]) => {
        if (key === "keywords" || key === "tags" || key === "blog_tags") {
          // If the key is 'keywords' or 'tags', or blogTags stringify the value and append it as a JSON string
          formData.append(key, JSON.stringify(value));
        } else {
          // For other keys like 'title', 'description' etc directly append the key-value pair
          formData.append(key, value);
        }
      });

      try {
        const response = await fetch(`/api/admin/blogs/${id}`, {
          method: "PUT",
          body: formData,
        });

        const data = await response.json();

        if (data.code === 200) {
          showSuccessToast("Blog Updated successfully!");
          router.push("/admin/blogs");
        } else if (data.code !== 201) {
          showErrorToast(
            data?.message?.issues[0]?.message || "Blog Edit Error!"
          );
        }
      } catch (error) {
        // Handle login error
        showErrorToast("Blog Edit Error!");
      }
    },
  });

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/blog-types").then((res) =>
        res.json()
      );
      setBlogType(response?.data);
    } catch (error) {
      // Handle login error
      showErrorToast("Blog fetch error!");
    }
  };
  // Fetch Blogs Data
  useEffect(() => {
    fetchBlogsData();
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
                    EDIT BLOG
                  </strong>
                </div>
                <div className="card-body">
                  <div className="row clearfix">
                    <div className="col-md-6 col-md-6 col-sm-6 mt-3">
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
                        {/* Error Message for Invalid Title */}
                        {formik.touched.title && formik.errors.title ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.title}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-md-6 col-md-6 col-sm-6 mt-3">
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
                        {/* Error Message for Invalid Slug */}
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
                          <option value="2">Published</option>
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


                    <div className="col-md-6 col-sm-12 mt-3">
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
                        {/* Error Message for Invalid Meta Title Name */}
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
                        {/* Error Message for Invalid Structured Data */}
                        {formik.touched.structured_data &&
                        formik.errors.structured_data ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.structured_data}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-12 mt-3">
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
                        value={formik.values.publish_date} // format as YYYY-MM-DD
                      />
                      {/* Date Error Message */}
                      {formik.touched.publish_date && formik.errors.publish_date ? (
                        <div className={classes.invalidDataError}>
                          {formik.errors.publish_date}
                        </div>
                      ) : null}  
                  </div>
                  </div>

                    <div className="col-md-6 col-sm-12">
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
                        {/* Error Message for Invalid Featured Image */}
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
                        ) : typeof formik?.values?.featured_image == "string" &&
                          formik?.values?.featured_image !== "" ? (
                          <Image
                            width={70}
                            height={70}
                            className="mt-2"
                            src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/blogs/${formik?.values?.featured_image}`}
                            alt="featured image"
                            loading="lazy"
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-12 mt-4">
                      <div className="form-group">
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
                        {/* Error Message for Invalid Featured Alt */}
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
                        {/* Error Message for Invalid Meta Description */}
                        {formik.touched.meta_description &&
                        formik.errors.meta_description ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.meta_description}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 col-sm-12 mt-3" >
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
                          autocomplete
                          handleInputChange={formik.handleChange}
                          handleInputBlur={formik.handleBlur}
                          value={formik.values.keywords}
                          placeholder="Enter keywords"
                        />
                      </div>

                      <div className="col-md-5 col-sm-12 mt-3" style={{marginLeft: "1%"}}>
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
                        {/* Error Message for Invalid Og Title */}
                        {formik.touched.og_title && formik.errors.og_title ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.og_title}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-12 mt-3">
                      <div className="form-group">
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
                        {/* Og Image Showing and Error handling */}
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
                        ) : typeof formik?.values?.og_image == "string" &&
                          formik?.values?.og_image !== "" ? (
                          <Image
                            width={70}
                            height={70}
                            className="mt-2"
                            src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/blogs/${formik?.values?.og_image}`}
                            alt="og image"
                            loading="lazy"
                          />
                        ) : (
                          ""
                        )}

                        {/* Error Message for Invalid Og Image */}
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
                        {/* Error Message for Invalid Og Alt */}
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
                        {/* Error Message for Invalid Og Description */}
                        {formik.touched.og_description &&
                        formik.errors.og_description ? (
                          <div className={classes.invalidDataError}>
                            {formik.errors.og_description}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-12 submit-btn  text-end">
                      {/* Close Button */}
                      <Link href={`/admin/blogs`}>
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;
