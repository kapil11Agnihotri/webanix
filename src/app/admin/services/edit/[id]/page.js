"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../../services.module.css";
import { showErrorToast, showSuccessToast } from "@/utils/toaster";
import { WithContext as ReactTags } from "react-tag-input";
import JoditEditor from "jodit-react";
import Button from "@/components/Button/Button";
import Link from "next/link";

const ServicesEdit = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const [keywords, setKeywords] = useState([]);
  const [tags, setTags] = useState([]);
  const [ogImage, setogImage] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [categoryList, setCategoryList] = useState([]);
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
    const file = e.target.files[0];
    formik.setFieldValue(e.target.name, file);
    if (e.target.name === "og_image") {
      setogImage(URL.createObjectURL(file));
      setShowOgImage(true);
    } else if (e.target.name === "featured_image") {
      setFeaturedImage(URL.createObjectURL(file));
      setShowFeaturedImage(true);
    }
  };

  const validationRules = {
    title: Yup.string().required("name is required"),
    slug: Yup.string().required("slug is required"),
    featured_image: Yup.string().required("featured image is required"),
    alt: Yup.string().required("alt is required"),
    short_description: Yup.string().required("short description is required"),
    category: Yup.string().required("category is required"),
  };

  const initialValues = {
    title: "",
    slug: "",
    short_description: "",
    featured_for: "",
    category: "",
    featured_image: "",
    alt: "",
    meta_title: "",
    meta_description: "",
    keywords: [],
    tags: [],
    og_title: "",
    og_description: "",
    og_image: "",
    og_alt: "",
    tech_images: [
      {
        image: "",
        alt: "",
      },
    ],

    description: [
      {
        heading: "",
        content: "",
      },
    ],
  };

  //using formik here for form data handling and submitting
  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: Yup.object(validationRules),

    onSubmit: async (values) => {
      const object = {
        title: values.title,
        slug: values.slug,
        description: values.description,
        short_description: values.short_description,
        featured_image: values.featured_image,
        alt: values.alt,
        category: values.category,
        featured_for: values.featured_for,
        meta_title: values.meta_title,
        meta_description: values.meta_description,
        keywords: keywords,
        tags: tags,
        og_title: values.og_title,
        og_description: values.og_description,
        og_image: values.og_image,
        og_alt: values.og_alt,
        tech_images: values?.tech_images?.map((techItem) => techItem.image),
      tech_images_alt: values?.tech_images?.map((techItem,index) => techItem.alt ?  techItem.alt : `alt-${index+1}`),
      };

      const formData = new FormData();
      // Appending each key-value pair from the object to the FormData object
      Object.entries(object).forEach(([key, value]) => {
        if (
          key === "keywords" ||
          key === "tech_images_alt" ||
          key === "tags" ||
          key === "featured_for" ||
          key === "description"
        ) {
          // If the key is 'page_json', stringify the value and append it as a JSON string
          formData.append(key, JSON.stringify(value));
        } else if (key === "tech_images") {
          let tech_images_name = [];

          value.forEach((image) => {
            if (typeof image == "string")
              tech_images_name.push(image);
            else
              formData.append("tech_images", image);
          });

          formData.append("tech_images_name", JSON.stringify(tech_images_name));
        } else {
          // Otherwise, directly append the key-value pair
          formData.append(key, value);
        }
      });

      try {
        const response = await fetch(`/api/admin/services/${id}`, {
          method: "PUT",
          body: formData,
        }).then((res) => res.json());

        if (response.code === 200) {
          showSuccessToast("Service updated successfully!");
          router.push("/admin/services");
        } else if (response.code === 422) {
          showErrorToast(response?.message?.issues[0]?.message);
        } else {
          showErrorToast(response?.message || "Service updation error!");
        }
      } catch (error) {
        // Handle login error
        showErrorToast("Service updation error!");
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

  //Add Row Function

  const handleServiceManipulation = (name, index, check) => {
    let rowsData = [...formik.values[name]];

    if (name === "tech_images") {
      if (check) {
        // Add a new row
        rowsData.push({
          image: "",
          alt: "",
        });
        formik.setFieldValue(`${name}`, rowsData);
      } else {
        // Remove a row
        if (rowsData.length > 1) {
          rowsData.splice(index, 1);
          formik.setFieldValue(`${name}`, rowsData);
        }
      }
    } else if (name === "description") {
      if (check) {
        // Add a new row
        rowsData.push({
          heading: "",
          content: "",
        });
        formik.setFieldValue(`${name}`, rowsData);
      } else {
        // Remove a row
        if (rowsData.length > 1) {
          rowsData.splice(index, 1);
          formik.setFieldValue(`${name}`, rowsData);
        }
      }
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/admin/services/${id}`).then(
        (response) => response.json()
      );
      const Data = await response.data;

      formik.setValues(Data);
      if (Data?.tech_images === null) {
        formik.setFieldValue("tech_images", [{ image: "", alt: "" }]);
      } else {
        formik.setFieldValue("tech_images", JSON?.parse(Data?.tech_images));
      }

      formik.setFieldValue(
        "featured_for",
        JSON?.parse(Data?.featured_for || "")
      );

     
      if (Data?.description === null) {
        formik.setFieldValue("description", [{ heading: "", content: "" }]);
      } else {
        formik.setFieldValue("description", JSON?.parse(Data?.description));
      }
      

      setKeywords(JSON.parse(Data.keywords));
      setTags(JSON.parse(Data.tags));
      // setogImage(Data.og_image);
    } catch (error) {
      showErrorToast("Service fetch error!");
    }

    try {
      const response = await fetch("/api/admin/categories").then((res) =>
        res.json()
      );

      setCategoryList(response.data);
    } catch (error) {
      // Handle login error
      showErrorToast("Category list fetch error:");
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
                  <Button text="Back" link="admin/services" icon="left" />
                </div>
                <div className="card">
                  <div className="card-header">
                    <h6
                      className="card-title"
                      style={{ fontSize: "18px", fontWeight: "unset" }}
                    >
                      EDIT SERVICE
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
                            placeholder="Name *"
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
                            onChange={handleImageChange}
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
                          ) : typeof formik?.values?.featured_image ==
                              "string" &&
                            formik?.values?.featured_image !== "" ? (
                            <Image
                              width={70}
                              height={70}
                              className="mt-2"
                              src={`/media/services/${formik?.values?.featured_image}`}
                              alt="featured image"
                              loading="lazy"
                            />
                          ) : (
                            ""
                          )}
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
                          <select
                            className="form-control"
                            id="category"
                            name="category"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.category}
                            style={{ margin: "2%" }}
                          >
                            <option selected disabled value="">
                              Select Category
                            </option>
                            {categoryList?.map((category_value, key) => (
                              <option
                                key={key + category_value.id}
                                value={category_value.id}
                              >
                                {category_value.title}
                              </option>
                            ))}
                          </select>
                          {formik.touched.category && formik.errors.category ? (
                            <div className={styles.invalidDataError}>
                              {formik.errors.category}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <input
                            id="short_description"
                            name="short_description"
                            type="text"
                            className="form-control"
                            placeholder="Short Description *"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values?.short_description}
                            style={{ margin: "2%" }}
                          />
                          {formik.touched.short_description &&
                          formik.errors.short_description ? (
                            <div className={styles.invalidDataError}>
                              {formik.errors.short_description}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <label style={{ marginLeft: "1%" }}>
                            Select Featured For:
                          </label>
                          <div className={styles.featuredCheckbox}>
                            <div>
                              <input
                                type="checkbox"
                                id="home page"
                                name="featured_for"
                                value="Home Page"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                checked={formik.values.featured_for.includes(
                                  "Home Page"
                                )}
                                style={{ margin: "2%" }}
                              />
                              Home Page
                            </div>

                            <div>
                              <input
                                type="checkbox"
                                id="service page"
                                name="featured_for"
                                value="Service Page"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                checked={formik.values.featured_for.includes(
                                  "Service Page"
                                )}
                                style={{ margin: "2%" }}
                              />
                              Service Page
                            </div>

                            <div>
                              <input
                                type="checkbox"
                                id="product page"
                                name="featured_for"
                                value="Product Page"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                checked={formik.values.featured_for.includes(
                                  "Product Page"
                                )}
                                style={{ margin: "2%" }}
                              />
                              Product Page
                            </div>

                            <div>
                              <input
                                type="checkbox"
                                id="service listing"
                                name="featured_for"
                                value="Service Listing"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                checked={formik.values.featured_for.includes(
                                  "Service Listing"
                                )}
                                style={{ margin: "2%" }}
                              />
                              Service Listing
                            </div>

                            <div>
                              <input
                                type="checkbox"
                                id="product listing"
                                name="featured_for"
                                value="Product Listing"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                checked={formik.values.featured_for.includes(
                                  "Product Listing"
                                )}
                                style={{ margin: "2%" }}
                              />
                              Product Listing
                            </div>
                          </div>
                          
                        </div>
                      </div>

                      {formik.values?.description?.map((card, index) => (
                        <React.Fragment key={index}>
                          <strong>{index + 1 + "."}</strong>
                          <div className="col-12">
                            <div className="form-group">
                              <input
                                id={`description_heading_${index}`}
                                name={`description[${index}].heading`}
                                type="text"
                                className="form-control"
                                placeholder={`Description ${index + 1} Heading`}
                                onChange={formik.handleChange}
                                value={
                                  formik.values?.description[index]?.heading
                                }
                                onBlur={formik.handleBlur}
                                style={{ margin: "1%" }}
                              />
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="form-group">
                              <JoditEditor
                                id={`description_content_${index + 1}`}
                                name={`description[${index}].content`}
                                className="form-control"
                                placeholder={`Description ${index + 1} Content`}
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    `description[${index}].content`,
                                    e
                                  )
                                }
                                onBlur={formik.handleBlur}
                                value={
                                  formik?.values?.description[index]
                                    ?.content
                                }
                                style={{ margin: "2%" }}
                              />
                            </div>
                          </div>

                          <div className="col-md-6 col-sm-12">
                            <div className="">
                              <button
                                className="btn btn-primary m-2"
                                type="button"
                                onClick={() => {
                                  handleServiceManipulation(
                                    "description",
                                    index,
                                    true
                                  );
                                }}
                              >
                                +
                              </button>
                              <button
                                className="btn btn-primary m-2"
                                type="button"
                                onClick={() => {
                                  handleServiceManipulation(
                                    "description",
                                    index,
                                    false
                                  );
                                }}
                              >
                                -
                              </button>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}

                      <h3 style={{ margin: "1%" }}>Service Images</h3>
                      {formik.values?.tech_images?.map((card, index) => (
                        <React.Fragment key={index}>
                          <strong>{index + 1 + "."}</strong>
                          <div className="col-md-6 col-sm-12">
                            <div className="form-group">
                              <input
                                id={`tech_images_${index}`}
                                name={`tech_images.[${index}].image`}
                                type="file"
                                accept="image/*"
                                className="form-control"
                                placeholder={`Card ${index + 1} Image`}
                                onChange={handleImageChange}
                                onBlur={formik.handleBlur}
                                style={{ margin: "2%" }}
                              />
                              {typeof formik.values?.tech_images[index].image ==
                                "string" &&
                              formik.values?.tech_images[index].image !== "" ? (
                                <Image
                                  width={70}
                                  height={70}
                                  className="mt-2"
                                  src={`/media/services/${formik?.values?.tech_images[index]?.image}`}
                                  // src={

                                  // }
                                  alt={`tech_images_${index + 1}_image_alt`}
                                  loading="lazy"
                                />
                              ) : (
                                ""
                              )}
                            </div>
                          </div>

                          <div className="col-md-6 col-sm-12">
                            <div className="form-group">
                              <input
                                id={`tech_images_${index + 1}_alt`}
                                name={`tech_images[${index}].alt`}
                                type="text"
                                className="form-control"
                                placeholder={`Card ${index + 1} Alt`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values?.tech_images[index].alt}
                                style={{ margin: "1%" }}
                              />
                            </div>
                          </div>

                          <div className="col-md-6 col-sm-12">
                            <div className="">
                              <button
                                className="btn btn-primary m-2"
                                type="button"
                                onClick={() => {
                                  handleServiceManipulation(
                                    "tech_images",
                                    index,
                                    true
                                  );
                                }}
                              >
                                +
                              </button>
                              <button
                                className="btn btn-primary m-2"
                                type="button"
                                onClick={() => {
                                  handleServiceManipulation(
                                    "tech_images",
                                    index,
                                    false
                                  );
                                }}
                              >
                                -
                              </button>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}

                      {/* meta field */}

                      <div className="row">
                        <h3 style={{ margin: "1%" }}>Meta Fields:</h3>
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
                              onChange={handleImageChange}
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
                            ) : typeof formik?.values?.og_image == "string" &&
                              formik?.values?.og_image !== "" ? (
                              <Image
                                width={70}
                                height={70}
                                className="mt-2"
                                src={`/media/services/${formik?.values?.og_image}`}
                                alt="og image"
                                loading="lazy"
                              />
                            ) : (
                              ""
                            )}
                            {formik.touched.og_image &&
                            formik.errors.og_image ? (
                              <div className={styles.invalidDataError}>
                                {formik.errors.og_image}
                              </div>
                            ) : null}
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
                        <Link href={`/admin/services`}>
                          <button
                            type="button"
                            id="services__edit_close_button"
                            className="btn btn-secondary mx-1"
                            data-dismiss="modal"
                          >
                            CLOSE
                          </button>
                        </Link>
                        <button
                          type="submit"
                          id="services_edit_update_button"
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

export default ServicesEdit;
