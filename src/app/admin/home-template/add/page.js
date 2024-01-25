"use client";
import Image from "next/image";
import React, { useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@/components/Button/Button";
import { showErrorToast, showSuccessToast } from "@/utils/toaster";
import { useRouter } from "next/navigation";

const AddPage = () => {
  const router = useRouter();
  const [keywords, setKeywords] = useState([]);
  const [ogImage, setogImage] = useState("");
  const [tags, setTags] = useState([]);

  const validationRules = {
    name: Yup.string().required("Pagename is required"),
    slug: Yup.string().required("slug is required"),
  };

  const initialValues = {
    name: "",
    slug: "",
    meta_title: "",
    meta_description: "",
    keywords: [],
    tags: [],
    og_title: "",
    og_description: "",
    og_image: "",
    og_alt: "",

    carouselSection: [{ heading: "", content: "", image: "", alt: "" }],
    secondSection: {
      heading: "",
      content: "",
      card: [
        {
          image: "",
          alt: "",
        },
        {
          image: "",
          alt: "",
        },
        {
          image: "",
          alt: "",
        },
        {
          image: "",
          alt: "",
        },
        {
          image: "",
          alt: "",
        },
        {
          image: "",
          alt: "",
        },
      ],
    },

    newsLetterSection: {
      image: "",
      alt: '',
      card: [
        {
          heading: "",
          content: "",
        },
        {
          heading: "",
          content: "",
        },
      ],
    },
  };

  //using formik here for form data handling
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object(validationRules),

    onSubmit: async (values) => {
      const object = {
        name: values.name,
        slug: values.slug,
        meta_title: values.meta_title,
        meta_description: values.meta_description,
        keywords: keywords,
        tags: tags,
        og_title: values.og_title,
        og_description: values.og_description,
        og_image: values.og_image,
        og_alt: values.og_alt,
        template_type: "home",
        page_json: values,
      };
      const formData = new FormData();
      // Appending each key-value pair from the object to the FormData object
      Object.entries(object).forEach(([key, value]) => {
        if (key === "page_json" || key === "keywords" || key === "tags") {
          // If the key is 'page_json', stringify the value and append it as a JSON string
          formData.append(key, JSON.stringify(value));
        } else {
          // Otherwise, directly append the key-value pair
          formData.append(key, value);
        }
      });
      try {
       const response =  await fetch("/api/admin/pages", {
          method: "POST",
          body: formData,
       });
        
        const res = await response.json();

        if (res.code === 201) {
          showSuccessToast("New Page created!");
          router.push("/admin/home-template");
        }
        else {
          showErrorToast(res.message?.issues[0]?.message || "Page creation error!");
        }

      } catch (error) {
        showErrorToast(error.message);
      }
    },
  });

  //Add Row Function
  const handleRowManipulation = (name, index, check) => {
    let rowsData = [...formik.values[name].card];

    if (check) {
      // Add a new row
      rowsData.push({ heading: "", content: "" });
      formik.setFieldValue(`${name}.card`, rowsData);
    } else {
      // Remove a row
      if (rowsData.length > 1) {
        rowsData.splice(index, 1);
        formik.setFieldValue(`${name}.card`, rowsData);
      }
    }
  };
  const handleRowCarousel = (name, index, check) => {
    let rowsData = [...formik.values[name]];

    if (check) {
      // Add a new row
      rowsData.push({ heading: "", content: "", image: "" });
      formik.setFieldValue(`${name}`, rowsData);
    } else {
      // Remove a row
      if (rowsData.length > 1) {
        rowsData.splice(index, 1);
        formik.setFieldValue(`${name}`, rowsData);
      }
    }
  };

  const onFileUpload = async (event, field, index) => {
    let formData = new FormData();
    formData.append("image", event.target.files[0]);
    if (field === "carouselSection") {
      formData.append("alt", formik.values[`${field}`][index]?.alt);
    } else if (field === 'newsLetterSection') {
      formData.append('alt', formik.values[`${field}`]?.alt)
    }
    else {
      formData.append("alt", formik.values[`${field}`].card[index]?.alt);
    }

    try {
      const response = await fetch("/api/admin/pages/file-upload", {
        method: "POST",
        body: formData,
      });
      const res = await response.json();

      if (res.code == 400) {
        event.target.value = "";
        showErrorToast(res.message);
      } else if (res.code == 201) {
        formik.setFieldValue(event.target.name, res.data);
      } else {
        // Handle the case where the response doesn't contain the expected data
        showErrorToast(res.message);
      }
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  //functions for keywords and tags
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
  };

  return (
    <div className='section-body'>
      <div className='container-fluid'>
        <div className='tab-content'>
          <form onSubmit={formik.handleSubmit}>
            <div
              className='tab-pane fade show active mt-3'
              id='page-add'
              role='tabpanel'
            >
              <div className='d-flex justify-content-start'>
                <Button
                  link='admin/home-template'
                  text='Back'
                  icon='left'
                />
              </div>
              <div className='card mt-3'>
                <div className='card-header'>
                  <strong
                    className='card-title'
                    style={{ fontSize: "20px" }}
                  >
                    ADD PAGE
                  </strong>
                </div>
                <div className='card-body'>
                  <div className='row'>
                    <div className='col-md-6 col-sm-12'>
                      <div className=''>
                        <input
                          id='name'
                          name='name'
                          type='text'
                          className='form-control'
                          placeholder='Page Name *'
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.name}
                          style={{ margin: "2%" }}
                        />
                      </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                      <div className=''>
                        <input
                          id='slug'
                          name='slug'
                          type='text'
                          className='form-control'
                          placeholder='Slug *'
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.slug}
                          style={{ margin: "2%" }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Banner Section starts */}
                  <div className='row'>
                    <h3 style={{ margin: "1%" }}>Banner Section:</h3>
                    {formik.values?.carouselSection?.map((card, index) => (
                      <React.Fragment key={index}>
                        <strong>{index + 1 + "."}</strong>

                        <div className='col-md-6 col-sm-12'>
                          <div className=''>
                            <input
                              id={`carousel_section_card_title_${index}`}
                              name={`carouselSection[${index}].heading`}
                              type='text'
                              className='form-control'
                              placeholder={`banner ${index + 1} heading*`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={card.heading}
                              style={{ margin: "2%" }}
                            />
                          </div>
                        </div>

                        <div className='col-md-6 col-sm-12 '>
                          <div className=''>
                            <input
                              id={`carousel_section_content_${index}`}
                              name={`carouselSection[${index}].content`}
                              type='text'
                              className='form-control'
                              placeholder={`banner ${index + 1} Content*`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={card.content}
                              style={{ margin: "2%" }}
                            />
                          </div>
                        </div>

                        <div className='col-md-6 col-sm-12'>
                          <div className=''>
                            <input
                              id={`carousel_section_card_image_${index}`}
                              name={`carouselSection[${index}].image`}
                              type='file'
                              className='form-control'
                              placeholder={`banner ${index + 1} Image*`}
                              onChange={(e) =>
                                onFileUpload(e, "carouselSection", index)
                              }
                              onBlur={formik.handleBlur}
                              style={{ margin: "2%" }}
                            />
                            {
                              card.image ? (
                              <Image
                                width={70}
                                height={70}
                                className='mt-2'
                                src={
                                  process.env.NEXT_PUBLIC_IMAGES_URL +
                                  `/pages/${card.image}`
                                }
                                alt={card?.alt}
                              />
                              ) : null
                            }
                          </div>
                        </div>

                        <div className='col-md-6 col-sm-12 '>
                          <div className=''>
                            <input
                              id={`carousel_section_alt_${index}`}
                              name={`carouselSection[${index}].alt`}
                              type='text'
                              className='form-control'
                              placeholder={`banner ${index + 1} Image alt*`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={card.alt}
                              style={{ margin: "2%" }}
                            />
                          </div>
                        </div>

                        <div className=''>
                          <button
                            className='btn btn-primary m-2'
                            type='button'
                            id={`carouselSection_addcard_${index}`}
                            onClick={() => {
                              handleRowCarousel("carouselSection", index, true);
                            }}
                          >
                            +
                          </button>
                          <button
                            className='btn btn-primary m-2'
                            type='button'
                            id={`innerpagetemplate_add_carousel_removecard_${index}`}
                            onClick={() => {
                              handleRowCarousel(
                                "carouselSection",
                                index,
                                false
                              );
                            }}
                          >
                            -
                          </button>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  {/* Second Section */}
                  <div className='row'>
                    <h3 style={{ margin: "1%" }}>Stories Section:</h3>
                    <div className='col-md-6 col-sm-12'>
                      <div className=''>
                        <input
                          id='second_section_heading'
                          name='secondSection.heading'
                          type='text'
                          className='form-control'
                          placeholder='Heading *'
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values?.secondSection?.heading}
                          style={{ margin: "2%" }}
                        />
                      </div>
                    </div>

                    <div className='col-md-6 col-sm-12'>
                      <div className=''>
                        <input
                          id='second_section_content'
                          name='secondSection.content'
                          type='text'
                          className='form-control'
                          placeholder='Content *'
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values?.secondSection?.content}
                          style={{ margin: "2%" }}
                        />
                      </div>
                    </div>

                    <h5 style={{ margin: "1%" }}>Images:</h5>
                    {formik.values.secondSection.card.map((card, index) => (
                      <React.Fragment key={index}>
                        <strong>{index + 1 + "."}</strong>

                        <div className='col-md-6 col-sm-12'>
                          <div className=''>
                            <input
                              id={`second_section_card_image_${index}`}
                              name={`secondSection.card[${index}].image`}
                              type='file'
                              className='form-control'
                              placeholder={`Card ${index + 1} Image*`}
                              onChange={(e) =>
                                onFileUpload(e, "secondSection", index)
                              }
                              onBlur={formik.handleBlur}
                              style={{ margin: "2%" }}
                            />
                            {typeof card.image == "string" &&
                            card.image !== "" ? (
                              <Image
                                width={70}
                                height={70}
                                className='mt-2'
                                src={
                                  process.env.NEXT_PUBLIC_IMAGES_URL +
                                  `/pages/${card?.image}`
                                }
                                alt={
                                  formik.values?.secondSection?.card[index]?.alt
                                }
                                loading='lazy'
                              />
                            ) : (
                              ""
                            )}
                          </div>
                        </div>

                        <div className='col-md-6 col-sm-12 '>
                          <div className=''>
                            <input
                              id={`second_section_alt_${index}`}
                              name={`secondSection.card[${index}].alt`}
                              type='text'
                              className='form-control'
                              placeholder={`story ${index + 1} Image alt*`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={card.alt}
                              style={{ margin: "2%" }}
                            />
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>

                  {/* NewsLetter Section */}
                  <div className='row'>
                    <h3 style={{ margin: "1%" }}>NewsLetter Section:</h3>
                    <h5 style={{ margin: "1%" }}>Image</h5>
                    <div className='col-md-6 col-sm-12'>
                      <div className=''>
                        <input
                          id={`newsLetter_section_image`}
                          name={`newsLetterSection.image`}
                          type='file'
                          className='form-control'
                          placeholder={`NewsLetter Image*`}
                          onChange={(e) => onFileUpload(e, "newsLetterSection")}
                          onBlur={formik.handleBlur}
                          style={{ margin: "2%" }}
                        />
                        {
                          `${formik.values?.newsLetterSection?.image}` ===
                          "" ? null:(
                            <Image
                              width={70}
                              height={70}
                              className='mt-2'
                              src={
                                process.env.NEXT_PUBLIC_IMAGES_URL +
                                `/pages/${formik.values?.newsLetterSection?.image}`
                              }
                              alt={formik.values?.newsLetterSection?.alt}
                              loading='lazy'
                            />
                        ) }
                      </div>
                    </div>

                    <div className='col-md-6 col-sm-12 '>
                      <div className=''>
                        <input
                          id={`newsLetterSection_alt`}
                          name={`newsLetterSection.alt`}
                          type='text'
                          className='form-control'
                          placeholder={`newsLetter Image alt*`}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values?.newsLetterSection?.alt}
                          style={{ margin: "2%" }}
                        />
                      </div>
                    </div>

                    <h5 style={{ margin: "1%" }}>Cards:</h5>
                    {formik.values?.newsLetterSection?.card.map((card, index) => (
                      <React.Fragment key={index}>
                        <strong>{index + 1 + "."}</strong>

                        <div className='col-md-6 col-sm-12'>
                          <div className=''>
                            <input
                              id={`news_letter_card_title_${index}`}
                              name={`newsLetterSection.card[${index}].heading`}
                              type='text'
                              className='form-control'
                              placeholder={`newsLetter Card ${
                                index + 1
                              } heading*`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={card.heading}
                              style={{ margin: "2%" }}
                            />
                          </div>
                        </div>

                        <div className='col-md-6 col-sm-12'>
                          <div className=''>
                            <input
                              id={`news_section_card_title_${index}`}
                              name={`newsLetterSection.card[${index}].content`}
                              type='text'
                              className='form-control'
                              placeholder={`newsLetter Card ${
                                index + 1
                              } Content*`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={card.content}
                              style={{ margin: "2%" }}
                            />
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  {/* Meta fields */}
                  <div className='row'>
                    <h3 style={{ margin: "1%" }}>Meta Fields:</h3>
                    <div className='col-md-6 col-sm-12'>
                      <div className=''>
                        <input
                          id='meta_title'
                          name='meta_title'
                          type='text'
                          className='form-control'
                          placeholder='meta title *'
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.meta_title}
                          style={{ margin: "2%" }}
                        />
                      </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                      <div className=''>
                        <input
                          id='meta_description'
                          name='meta_description'
                          type='text'
                          className='form-control'
                          placeholder='meta description'
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.meta_description}
                          style={{ margin: "2%" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div
                      className='col-md-12 col-sm-12'
                      style={{ marginLeft: "1%" }}
                    >
                      <h5 style={{ marginTop: "1%" }}>Keywords:</h5>
                      <ReactTags
                        tags={keywords}
                        id='keywords'
                        name='keywords'
                        delimiters={delimiters}
                        handleDelete={handleDeleteKeywords}
                        handleAddition={handleAdditionKeywords}
                        handleDrag={handleDragKeywords}
                        inputFieldPosition='bottom'
                        autocomplete
                        handleInputChange={formik.handleChange}
                        handleInputBlur={formik.handleBlur}
                        value={formik.values.keywords}
                        placeholder='Enter keywords'
                      />
                    </div>
                    <div
                      className='col-md-12 col-sm-12 '
                      style={{ marginLeft: "1%" }}
                    >
                      <h5 style={{ marginTop: "1%" }}>Tags:</h5>
                      <ReactTags
                        tags={tags}
                        id='tags'
                        name='tags'
                        delimiters={delimiters}
                        handleDelete={handleDeleteTags}
                        handleAddition={handleAdditionTags}
                        handleDrag={handleDragTags}
                        inputFieldPosition='bottom'
                        autocomplete
                        handleInputChange={formik.handleChange}
                        handleInputBlur={formik.handleBlur}
                        value={formik.values.tags}
                        placeholder='Enter tags'
                      />
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-6 col-sm-12'>
                      <div className=''>
                        <input
                          id='og_title'
                          name='og_title'
                          type='text'
                          className='form-control'
                          placeholder='Og title'
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.og_title}
                          style={{ margin: "2%" }}
                        />
                      </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                      <div className=''>
                        <input
                          id='og_description'
                          name='og_description'
                          type='text'
                          className='form-control'
                          placeholder='Og description'
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.og_description}
                          style={{ margin: "2%" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-6 col-sm-12'>
                      <div className=''>
                        <input
                          id='og_image'
                          name='og_image'
                          type='file'
                          className='form-control'
                          placeholder='Og Image'
                          onChange={(e) => handleImageChange(e)}
                          accept='image/*'
                          onBlur={formik.handleBlur}
                          style={{ margin: "2%" }}
                        />
                        {typeof ogImage == "string" && ogImage !== "" ? (
                          <Image
                            width={70}
                            height={70}
                            className='mt-2'
                            src={ogImage}
                            alt='client logo'
                            loading='lazy'
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                      <div className=''>
                        <input
                          id='og_alt'
                          name='og_alt'
                          type='text'
                          className='form-control'
                          placeholder='Og alt'
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.og_alt}
                          style={{ margin: "2%" }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Buttons Section */}
                  <div className='col-12 text-end'>
                    <hr className='mt-4' />
                    <button
                      type='button'
                      id='innerpagetemplate_add_close_button'
                      className='btn btn-secondary mx-1 '
                      data-dismiss='modal'
                    >
                      CLOSE
                    </button>

                    <button
                      type='submit'
                      id='innerpagetemplate_add_submit_button'
                      className='btn btn-primary'
                    >
                      SUBMIT
                    </button>
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

export default AddPage;
