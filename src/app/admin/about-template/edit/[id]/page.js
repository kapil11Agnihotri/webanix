'use client';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { showErrorToast, showSuccessToast } from '@/utils/toaster';
import { WithContext as ReactTags } from 'react-tag-input';
import Link from 'next/link';
import Button from '@/components/Button/Button';


const EditPage = ({params}) => {
  const router = useRouter();
  const { id } = params;
   const [keywords, setKeywords] = useState([]);
   const [ogImage, setogImage] = useState('');
   const [tags, setTags] = useState([]);
 

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
     formik.setFieldValue('og_image', file);
   };


  const validationRules = {
    name: Yup.string().required("Pagename is required"),
    slug: Yup.string().required("slug is required"),
  };

  const fetchPageData = async () => {
    try {
      const response = await fetch(`/api/admin/pages/${id}`);
      const res = await response.json();
      if (res.code === 200) {
        const parsedData = await JSON.parse(JSON.parse(res.data.page_json));
        formik.setValues(res?.data);
        formik.setValues(parsedData);
      } else {
        showErrorToast(res.message);
      }
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);


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

    bannerSection: {
      heading: "",
      content: "",
      backgroundImage: "",
      alt: "",
    },
    servicesSection: {
      heading: "",
      content: "",
      image: "",
      alt: "",
      card: [
        {
          heading: "",
          content: "",
        },
      ],
    },
    midPageHeading: "",
    productsSection: {
      heading: "",
      content: "",
      image: "",
      alt: "",
      card: [
        {
          heading: "",
          content: "",
        },
      ],
    },
    solutionsSection: {
      heading: "",
      content: "",
      image: "",
      alt: "",
      card: [
        {
          heading: "",
          content: "",
        },
      ],
    },
  };

  //using formik here for form data handling
  const formik = useFormik({
    initialValues:initialValues,
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
        template_type: 'about',
        page_json: values,
      };
      const formData = new FormData();
      // Appending each key-value pair from the object to the FormData object
      Object.entries(object).forEach(([key, value]) => {
        if (key === 'keywords' || key === 'tags' ||  key === "page_json" ) {
          // If the key is 'page_json', stringify the value and append it as a JSON string
          formData.append(key, JSON.stringify(value));
        } else {
          // Otherwise, directly append the key-value pair
          formData.append(key, value);
        }
      });
      try {
        const response = await fetch(`/api/admin/pages/${id}`, {
          method: "PUT",
          body: formData,
        });
        const res = await response.json();

        if (res.code === 201) {
          showSuccessToast(res.message);
          router.push("/admin/about-template");
        } else {
          showErrorToast(res.message);
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
      rowsData.push({ heading: '', content: '' });
      formik.setFieldValue(`${name}.card`, rowsData);
    } else {
      // Remove a row
      if (rowsData.length > 1) {
        rowsData.splice(index, 1);
        formik.setFieldValue(`${name}.card`, rowsData);
      }
    }
  };

  const onFileUpload = async(event) => {
    let formData = new FormData();
    formData.append('image', event.target.files[0]);
    
    try {
      const response = await fetch("/api/admin/pages/file-upload", {
        method: "POST",
        body:formData,
      });
      formik.setFieldValue(event.target.name, response.data);
    } catch (error) {
      showErrorToast(error.message)
    }
  };

  return (
    <>
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
                    <strong>EDIT About Page</strong>
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
                      <div className='col-md-6 col-sm-12'>
                        <div className=''>
                          <input
                            id='banner_heading'
                            name='bannerSection.heading'
                            type='text'
                            className='form-control'
                            placeholder='Heading *'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.bannerSection.heading}
                            style={{ margin: "2%" }}
                          />
                        </div>
                      </div>

                      <div className='col-md-6 col-sm-12'>
                        <div className=''>
                          <input
                            id='banner_content'
                            name='bannerSection.content'
                            type='text'
                            className='form-control'
                            placeholder='Content *'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.bannerSection.content}
                            style={{ margin: "2%" }}
                          />
                        </div>
                      </div>

                      <div className='col-md-6 col-sm-12'>
                        <div className=''>
                          <input
                            id='banner_background'
                            name='bannerSection.backgroundImage'
                            type='file'
                            className='form-control'
                            placeholder='Background Image *'
                            onChange={(e) => onFileUpload(e, "bannerSection")}
                            onBlur={formik.handleBlur}
                            style={{ margin: "2%" }}
                          />
                          {typeof formik.values.bannerSection.backgroundImage ==
                            "string" &&
                          formik.values.bannerSection.backgroundImage !== "" ? (
                            <Image
                              width={70}
                              height={70}
                              className='mt-2'
                              src={
                                process.env.NEXT_PUBLIC_IMAGES_URL +
                                `/pages/${formik.values?.bannerSection?.backgroundImage}`
                              }
                              alt={formik.values?.bannerSection?.alt}
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
                            id='banner_alt'
                            name='bannerSection.alt'
                            type='text'
                            className='form-control'
                            placeholder={`banner Image alt`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.bannerSection.alt}
                            style={{ margin: "2%" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sevices Section */}
                    <div className='row'>
                      <h3 style={{ margin: "1%" }}>Services Section:</h3>
                      <div className='col-md-6 col-sm-12'>
                        <div className=''>
                          <input
                            id='services_heading'
                            name='servicesSection.heading'
                            type='text'
                            className='form-control'
                            placeholder='Heading *'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.servicesSection.heading}
                            style={{ margin: "2%" }}
                          />
                        </div>
                      </div>

                      <div className='col-md-6 col-sm-12'>
                        <div className=''>
                          <input
                            id='services_content'
                            name='servicesSection.content'
                            type='text'
                            className='form-control'
                            placeholder='Content *'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.servicesSection.content}
                            style={{ margin: "2%" }}
                          />
                        </div>
                      </div>

                      <div className='col-md-6 col-sm-12'>
                        <div className=''>
                          <input
                            id='services_image'
                            name='servicesSection.image'
                            type='file'
                            className='form-control'
                            placeholder='Image *'
                            onChange={(e) => onFileUpload(e, "servicesSection")}
                            onBlur={formik.handleBlur}
                            style={{ margin: "2%" }}
                          />
                          {typeof formik.values.servicesSection.image ==
                            "string" &&
                          formik.values.servicesSection.image !== "" ? (
                            <Image
                              width={70}
                              height={70}
                              className='mt-2'
                              src={
                                process.env.NEXT_PUBLIC_IMAGES_URL +
                                `/pages/${formik.values?.servicesSection?.image}`
                              }
                              alt={formik.values.servicesSection.image}
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
                            id='services_alt'
                            name='servicesSection.alt'
                            type='text'
                            className='form-control'
                            placeholder={`services Section Image alt`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.servicesSection.alt}
                            style={{ margin: "2%" }}
                          />
                        </div>
                      </div>

                      {formik.values.servicesSection.card.map((card, index) => (
                        <React.Fragment key={index}>
                          <strong>{index + 1 + "."}</strong>
                          <div className='col-md-6 col-sm-12'>
                            <div className=''>
                              <input
                                id={`services_card_heading_${index}`}
                                name={`servicesSection.card[${index}].heading`}
                                type='text'
                                className='form-control'
                                placeholder={`Card ${index + 1} Heading*`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={card.heading}
                                style={{ margin: "2%" }}
                              />
                            </div>
                          </div>

                          <div className='col-12'>
                            <div className=''>
                              <input
                                id={`services_card_content_${index}`}
                                name={`servicesSection.card[${index}].content`}
                                type='text'
                                className='form-control'
                                placeholder={`Card ${index + 1} Content*`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={card.content}
                                style={{ margin: "1%" }}
                              />
                            </div>
                          </div>

                          <div className=''>
                            <button
                              className='btn btn-primary m-2'
                              id={`abouttemplate_add_servicesection_addcard_${index}`}
                              type='button'
                              onClick={() => {
                                handleRowManipulation(
                                  "servicesSection",
                                  index,
                                  true
                                );
                              }}
                            >
                              +
                            </button>
                            <button
                              className='btn btn-primary m-2'
                              id={`abouttemplate_add_servicesection_removecard_${index}`}
                              type='button'
                              onClick={() => {
                                handleRowManipulation(
                                  "servicesSection",
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

                    {/* mid Section */}
                    <div className='row'>
                      <div className='col-md-6 col-sm-12'>
                        <div className=''>
                          <input
                            id='midPageHeading'
                            name='midPageHeading'
                            type='text'
                            className='form-control'
                            placeholder='Page Middle Heading *'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.midPageHeading}
                            style={{ margin: "2%" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Products Section */}
                    <div className='row'>
                      <h3 style={{ margin: "1%" }}>Products Section:</h3>
                      <div className='col-md-6 col-sm-12'>
                        <div className=''>
                          <input
                            id='products_heading'
                            name='productsSection.heading'
                            type='text'
                            className='form-control'
                            placeholder='Heading *'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.productsSection.heading}
                            style={{ margin: "2%" }}
                          />
                        </div>
                      </div>
                      <div className='col-md-6 col-sm-12'>
                        <div className=''>
                          <input
                            id='products_content'
                            name='productsSection.content'
                            type='text'
                            className='form-control'
                            placeholder='Content *'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.productsSection.content}
                            style={{ margin: "2%" }}
                          />
                        </div>
                      </div>
                      <div className='col-md-6 col-sm-12'>
                        <div className=''>
                          <input
                            id='products_image'
                            name='productsSection.image'
                            type='file'
                            className='form-control'
                            placeholder='Image *'
                            onChange={(e) => onFileUpload(e, "productsSection")}
                            onBlur={formik.handleBlur}
                            style={{ margin: "2%" }}
                          />
                          {typeof formik.values.productsSection.image ==
                            "string" &&
                          formik.values.productsSection.image !== "" ? (
                            <Image
                              width={70}
                              height={70}
                              className='mt-2'
                              src={
                                process.env.NEXT_PUBLIC_IMAGES_URL +
                                `/pages/${formik.values?.productsSection?.image}`
                              }
                              alt={formik.values.productsSection.image}
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
                            id='products_alt'
                            name='productsSection.alt'
                            type='text'
                            className='form-control'
                            placeholder={`products Section Image alt`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.productsSection.alt}
                            style={{ margin: "2%" }}
                          />
                        </div>
                      </div>
                      {formik.values.productsSection.card.map((card, index) => (
                        <React.Fragment key={index}>
                          <strong>{index + 1 + "."}</strong>
                          <div className='col-md-6 col-sm-12'>
                            <div className=''>
                              <input
                                id={`products_card_heading_${index}`}
                                name={`productsSection.card[${index}].heading`}
                                type='text'
                                className='form-control'
                                placeholder={`Card ${index + 1} Heading*`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={card.heading}
                                style={{ margin: "2%" }}
                              />
                            </div>
                          </div>

                          <div className='col-12'>
                            <div className=''>
                              <input
                                id={`products_card_content_${index}`}
                                name={`productsSection.card[${index}].content`}
                                type='text'
                                className='form-control'
                                placeholder={`Card ${index + 1} Content*`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={card.content}
                                style={{ margin: "1%" }}
                              />
                            </div>
                          </div>

                          <div className=''>
                            <button
                              className='btn btn-primary m-2'
                              type='button'
                              id={`abouttemplate_add_productsection_addcard_${index}`}
                              onClick={() => {
                                handleRowManipulation(
                                  "productsSection",
                                  index,
                                  true
                                );
                              }}
                            >
                              +
                            </button>
                            <button
                              className='btn btn-primary m-2'
                              type='button'
                              id={`abouttemplate_add_productsection_removecard_${index}`}
                              onClick={() => {
                                handleRowManipulation(
                                  "productsSection",
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

                    {/* Solutions Section */}
                    <div className='row'>
                      <h3 style={{ margin: "1%" }}>Solutions Section:</h3>

                      <div className='col-md-6 col-sm-12'>
                        <div className=''>
                          <input
                            id='solutions_heading'
                            name='solutionsSection.heading'
                            type='text'
                            className='form-control'
                            placeholder='Heading *'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.solutionsSection.heading}
                            style={{ margin: "2%" }}
                          />
                        </div>
                      </div>

                      <div className='col-md-6 col-sm-12'>
                        <div className=''>
                          <input
                            id='solutions_content'
                            name='solutionsSection.content'
                            type='text'
                            className='form-control'
                            placeholder='Content *'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.solutionsSection.content}
                            style={{ margin: "2%" }}
                          />
                        </div>
                      </div>

                      <div className='col-md-6 col-sm-12'>
                        <div className=''>
                          <input
                            id='solutions_image'
                            name='solutionsSection.image'
                            type='file'
                            className='form-control'
                            placeholder='Image *'
                            onChange={(e) =>
                              onFileUpload(e, "solutionsSection")
                            }
                            onBlur={formik.handleBlur}
                            style={{ margin: "2%" }}
                          />
                          {typeof formik.values.solutionsSection.image ==
                            "string" &&
                          formik.values.solutionsSection.image !== "" ? (
                            <Image
                              width={70}
                              height={70}
                              className='mt-2'
                              src={
                                process.env.NEXT_PUBLIC_IMAGES_URL +
                                `/pages/${formik.values?.solutionsSection?.image}`
                              }
                              alt={formik.values?.solutionsSection?.image}
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
                            id='solutions_alt'
                            name='solutionsSection.alt'
                            type='text'
                            className='form-control'
                            placeholder={`solutions Section Image alt`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.solutionsSection.alt}
                            style={{ margin: "2%" }}
                          />
                        </div>
                      </div>

                      {formik.values.solutionsSection.card.map(
                        (card, index) => (
                          <React.Fragment key={index}>
                            <strong>{index + 1 + "."}</strong>
                            <div className='col-md-6 col-sm-12'>
                              <div className=''>
                                <input
                                  id={`solutions_card_heading_${index}`}
                                  name={`solutionsSection.card[${index}].heading`}
                                  type='text'
                                  className='form-control'
                                  placeholder={`Card ${index + 1} Heading*`}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={card.heading}
                                  style={{ margin: "2%" }}
                                />
                              </div>
                            </div>

                            <div className='col-12'>
                              <div className=''>
                                <input
                                  id={`solutions_card_content_${index}`}
                                  name={`solutionsSection.card[${index}].content`}
                                  type='text'
                                  className='form-control'
                                  placeholder={`Card ${index + 1} Content*`}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={card.content}
                                  style={{ margin: "1%" }}
                                />
                              </div>
                            </div>

                            <div className=''>
                              <button
                                className='btn btn-primary m-2'
                                type='button'
                                id={`abouttemplate_add_solutionsection_addcard_${index}`}
                                onClick={() => {
                                  handleRowManipulation(
                                    "solutionsSection",
                                    index,
                                    true
                                  );
                                }}
                              >
                                +
                              </button>
                              <button
                                className='btn btn-primary m-2'
                                type='button'
                                id={`abouttemplate_add_solutionsection_removecard_${index}`}
                                onClick={() => {
                                  handleRowManipulation(
                                    "solutionsSection",
                                    index,
                                    false
                                  );
                                }}
                              >
                                -
                              </button>
                            </div>
                          </React.Fragment>
                        )
                      )}
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
                      <Link href={`/admin/about-template`}>
                        <button
                          type='button'
                          id='abouttemplate_add_close_button'
                          className='btn btn-secondary mx-1 '
                          data-dismiss='modal'
                        >
                          CLOSE
                        </button>
                      </Link>
                      <button
                        type='submit'
                        id='abouttemplate_add_submit_button'
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
    </>
  );
};

export default EditPage;
