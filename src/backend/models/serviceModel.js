// import npm packages
import { v4 as uuidv4 } from "uuid";

// import some custom modules
import { query } from "@/backend/config/db";
import { getCurrentDateTime } from "@/backend/helpers/commonHelper";
import { uploadMultiple, uploadSingle } from "../helpers/fileUploadHelper";

//Function to get services
export const get_services = async () => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define the response values
    (message = "No services found"), (code = 404);

    // get all non deleted services
    const services = await query(
      `SELECT services.*, services.category AS category_id, categories.title AS category_name FROM services LEFT JOIN categories ON services.category = categories.id WHERE services.is_deleted = 0 ORDER BY created_at DESC`
    );


    if (services.length) {
      message = "Services list fetched successfully!";
      code = 200;
      data = services;
    }

  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

//Function to get services by id
export const get_service_by_id = async (id) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define the response values
    (message = "No services found"), (code = 404);

    // get services
    const services = await query(
      `SELECT services.*, services.category AS category_id, categories.title AS category_name FROM services LEFT JOIN categories ON services.category = categories.id WHERE services.id = '${id}' AND services.is_deleted = 0`
    );

    if (services.length) {
      message = "service fetched successfully!";
      code = 200;
      data = services[0];
    }

  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

//Function to get service by slug
export const get_service_by_slug = async (slug) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define the response values
    (message = "No services found"), (code = 404);

    // get by slug
    const services = await query(
      `SELECT services.*, services.category AS category_id, categories.title AS category_name FROM services LEFT JOIN categories ON services.category = categories.id WHERE services.slug = '${slug}' AND services.is_deleted = 0`
    );

    if (services.length) {
      message = "service fetched successfully!";
      code = 200;
      data = services[0];
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

//Function to get service by category
export const get_service_by_category = async (category) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define the response values
    (message = "No services found"), (code = 404);

    // get by category
    const services = await query(
      `SELECT services.*, services.category AS category_id, categories.title AS category_name FROM services LEFT JOIN categories ON services.category = categories.id WHERE services.category = '${category}' AND services.is_deleted = 0`
    );

    if (services.length) {
      message = "service fetched successfully!";
      code = 200;
      data = services[0];
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

//Function to create service
export const store = async (body, files) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // define id and current time
    const uuid = uuidv4();
    const createdAt = getCurrentDateTime();

    // get all upcoming meta related values from body
    const meta_title = body?.meta_title || null;
    const meta_description = body?.meta_description || null;
    const keywords = body?.keywords || null;
    const tags = body?.tags || null;
    const og_title = body?.og_title || null;
    const og_description = body?.og_description || null;
    const structured_data = body?.structured_data || null;
    // **************************************************************

    // *************** file upload code define here *****************
    let og_image = files?.get("og_image") || null;
    let og_alt = body?.og_alt || null;

    let featured_image = files?.get("featured_image") || null;
    let alt = body?.alt || null;

    // pre-define the tech_images array
    let tech_images = [];

    // if files contain any media files then gose into the if condition
    if (Array.from(files.keys()).length) {
      //

      // check og_image have og_alt or not
      if (og_image && !og_alt) {
        message = "Alt tag is required for og image";
        code = 400;
        data = [];

        return { message, data, code };
      }

      // check featured_image have alt or not
      if (featured_image && !alt) {
        message = "Alt tag is required for featured image";
        code = 400;
        data = [];

        return { message, data, code };
      }

      // if body contain any tech_images and tech_images_alt
      if (files?.get("tech_images") && body?.tech_images_alt) {
        //

        // get all files and it's alt value fron upcoming body and files
        let tech_images_files = [];
        let tech_images_alt = JSON.parse(body?.tech_images_alt);

        for (let [key, value] of files.entries()) {
          if (key === "tech_images") tech_images_files.push(value);
        }

        if (tech_images_alt.length != tech_images_files.length) {
          return {
            message: "Length of tech_images and tech_images_alt should be same",
            code: 400,
            data: [],
          };
        }

        // uploading all tech_images which is array of an image
        let response = await uploadMultiple(tech_images_files, "services");

        if (response.code === 201 && response.data.length) {
          tech_images_files = response.data;
        } else return response;

        // convert both array into array of an object
        for (let i = 0; i < tech_images_files.length; i++) {
          tech_images.push({
            image: tech_images_files[i],
            alt: tech_images_alt[i],
          });
        }
      }

      // if we have or_image or og_alt both then upload file
      if (og_image && og_alt) {
        // upload files here
        let response = await uploadSingle(og_image, "services");

        if (response.code === 201 && response.data != null) {
          og_image = response.data;
        } else return response;
      }

      // if we have featured_image or alt both then upload file
      if (featured_image && alt) {
        // upload files here
        let response = await uploadSingle(featured_image, "services");

        if (response.code === 201 && response.data != null) {
          featured_image = response.data;
        } else return response;
      }

      //
    }

    // convert into json string for storing into the database
    tech_images = tech_images.length ? JSON.stringify(tech_images) : null;
    // ****************************************************************

    // pre-define the response values
    (message = "Error in creating service"), (code = 400);

    // Insert query
    const services = await query(
      `INSERT INTO services (id, slug, title, description,  short_description, featured_for, category, tech_images, featured_image, alt, meta_title, meta_description, keywords, structured_data, tags, og_title, og_description, og_image, og_alt, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        uuid,
        body.slug,
        body.title,
        body.description,
        body.short_description,
        body.featured_for,
        body.category,
        tech_images,
        featured_image,
        alt,
        meta_title,
        meta_description,
        keywords,
        structured_data,
        tags,
        og_title,
        og_description,
        og_image,
        og_alt,
        createdAt,
        createdAt,
      ]
    );

    if (services.affectedRows) {
      services.insertId = uuid;
      message = "Service created successfully!";
      data = services;
      code = 201;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

//Function to update service
export const update = async (id, body, files) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // get service by id
    const service = await query(
      `SELECT * FROM services WHERE id = '${id}' AND is_deleted = 0`
    );

    // defien current time here
    const updated_at = getCurrentDateTime();

    // get all meta fields and assign it to variables
    const meta_title = body.meta_title || service[0]["meta_title"];
    const meta_description =
      body.meta_description || service[0]["meta_description"];
    const keywords = body.keywords || service[0]["keywords"];
    const tags = body.tags || service[0]["tags"];
    const og_title = body.og_title || service[0]["og_title"];
    const og_description = body.og_description || service[0]["og_description"];
    const structured_data =
      body.structured_data || service[0]["structured_data"];
    // *************************************************************

    // *************** file upload code define here *****************
    let og_image = files?.get("og_image") || service[0].og_image;
    let og_alt = body?.og_alt || service[0].og_alt;

    let featured_image =
      files?.get("featured_image") || service[0].featured_image;
    let alt = body?.alt || service[0].alt;

    console.log("jdskfsdjflkdsjlkds");

    // pre-define the tech_images array
    let tech_images = JSON.parse(body?.tech_images_name) || [];
    let tech_images_alt = JSON.parse(body?.tech_images_alt);

    // if files contain any media files then gose into the if condition
    if (Array.from(files.keys()).length) {

      // check og_image have og_alt or not
      if (files?.get("og_image") && !og_alt) {
        message = "Alt tag is required for og image";
        code = 400;
        data = [];

        return { message, data, code };
      }

      // check featured_image have alt or not
      if (files?.get("featured_image") && !alt) {
        message = "Alt tag is required for featured image";
        code = 400;
        data = [];

        return { message, data, code };
      }

      // if body contain any tech_images and tech_images_alt
      if (files?.get("tech_images") && body?.tech_images_alt) {
        // get all files and it's alt value fron upcoming body and files
        let tech_images_files = [];

        for (let [key, value] of files.entries()) {
          if (key === "tech_images") tech_images_files.push(value);
        }

        if (tech_images_alt.length != tech_images_files.length + tech_images.length) {
          return {
            message: "Length of tech_images and tech_images_alt should be same",
            code: 400,
            data: [],
          };
        }

        // uploading all tech_images which is array of an image
        let response = await uploadMultiple(tech_images_files, "services");

        if (response.code === 201 && response.data.length) {
          tech_images_files = response.data;
        } else return response;

        tech_images = [...tech_images, ...tech_images_files];
      }

      // if we have or_image or og_alt both then upload file
      if (files?.get("og_image") && og_alt) {
        // upload files here
        let response = await uploadSingle(og_image, "services");

        if (response.code === 201 && response.data != null) {
          og_image = response.data;
        } else return response;
      }

      // if we have featured_image or alt both then upload file
      if (files?.get("featured_image") && alt) {
        // upload files here
        let response = await uploadSingle(featured_image, "services");

        if (response.code === 201 && response.data != null) {
          featured_image = response.data;
        } else return response;
      }

    }

    let new_tech_images = [];
    for (let i = 0; i < tech_images.length; i++) { 
      new_tech_images.push({image : tech_images[i], alt : tech_images_alt[i]})
    }

    new_tech_images = JSON.stringify(new_tech_images);
    // ****************************************************************

    // pre-define the response values
    (message = "Error in updating services"), (code = 400);

    const services = await query(
      `UPDATE services SET slug = ?, title = ?, description = ?, short_description = ?, featured_for = ?, category = ?, tech_images = ?, featured_image = ?, alt = ?, meta_title = ?, meta_description = ?, keywords = ?, structured_data = ?, tags = ?, og_title = ?, og_description = ?, og_image = ?, og_alt = ?, updated_at = ? WHERE id = ?`,
      [
        body.slug,
        body.title,
        body.description,
        body.short_description,
        body.featured_for,
        body.category,
        new_tech_images,
        featured_image,
        alt,
        meta_title,
        meta_description,
        keywords,
        structured_data,
        tags,
        og_title,
        og_description,
        og_image,
        og_alt,
        updated_at,
        id,
      ]
    );

    if (services.affectedRows) {
      message = "service updated successfully!";
      data = services;
      code = 200;
    }

  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

//Function to delete service
export const delete_service = async (id) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define response message
    (message = "Error in deleting service"), (code = 400);

    // soft delete the service
    const services = await query(
      `UPDATE services SET is_deleted = ? WHERE id = ?`,
      [1, id]
    );

    if (services.affectedRows) {
      message = "Service deleted successfully!";
      data = services;
      code = 200;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

// file upload in pages
export const file_upload = async (body, files, baseURL, folder) => {
  let message = "Something Went Wrong",
    code = 500,
    data = null;

  try {
    let image = null;
    let alt = body?.alt || null;

    // pre-define response message
    (message = "Error In Generating File Url"), (code = 400);

    if (files?.get("image") && !alt) {
      message = "Alt tag is required for image";
      code = 400;
      data = [];

      return { message, data, code };
    }

    if (Array.from(files.keys()).length) {
      // upload files here
      let response = await uploadSingle(files?.get("image"), "services");

      if (response.code === 201 && response.data != null) {
        image = response.data;
      } else return response;
    }


    if (image) {
      message = "File Url Generated Successfully!";
      data = image;
      code = 201;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};
