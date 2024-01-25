// import npm packages
import { v4 as uuidv4 } from "uuid";

// import some custom modules
import { query } from "@/backend/config/db";
import { getCurrentDateTime } from "@/backend/helpers/commonHelper";
import { uploadSingle } from "../helpers/fileUploadHelper";

//Function to get blog type list
export const get_blog_types = async () => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define response message
    (message = "No Blog type found"), (code = 404);

    // get all blog types
    const blogType = await query(
      `SELECT * FROM blog_types WHERE is_deleted = ? ORDER BY created_at DESC`,
      [0]
    );

    if (blogType.length) {
      message = "Blog Type list fetched successfully!";
      code = 200;
      data = blogType;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

//Function to get blog type by id
export const get_blog_type_by_id = async (id) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define response message
    (message = "No Blog type found"), (code = 404);

    // get blog by id
    const blogType = await query(
      `SELECT * FROM blog_types WHERE id = ? AND is_deleted = ?`,
      [id, 0]
    );

    if (blogType.length) {
      message = "Blog Type list fetched successfully!";
      code = 200;
      data = blogType[0];
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

//Function to create blog type
export const store = async (body, files) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // define id and current time
    const id = uuidv4();
    const createdAt = getCurrentDateTime();

    // get all upcoming meta related values from body
    const meta_title = body.meta_title || null;
    const meta_description = body.meta_description || null;
    const keywords = body.keywords || null;
    const tags = body.tags || null;
    const og_title = body.og_title || null;
    const og_description = body.og_description || null;
    const structured_data = body.structured_data || null;

    // get all files and it's alt value fron upcoming body and files
    let og_image = files?.get("og_image") || null;
    let og_alt = body?.og_alt || null;

    // if files contain any media files then gose into the if condition
    if (Array.from(files.keys()).length) {
      //

      // check files have og_image or not
      if (og_image && !og_alt) {
        message = "Alt tag is required for og image";
        code = 400;
        data = [];

        return { message, data, code };
      }

      if (og_image && og_alt) {
        // upload files here
        let response = await uploadSingle(og_image, "blogTypes");

        if (response.code === 201 && response.data != null) {
          og_image = response.data;
        } else return response;
      }

      //
    }
    // ****************************************************************

    // pre-define the response values
    (message = "Error in creating blog type"), (code = 400);

    // insert blog type : SQL query
    const blogType = await query(
      `INSERT INTO blog_types (id, name, meta_title, meta_description, keywords, structured_data, tags, og_title, og_description, og_image, og_alt, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        id,
        body.name,
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

    if (blogType) {
      blogType.insertId = id;
      message = "Blog type created successfully!";
      data = blogType;
      code = 201;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

//Function to update blog type
export const update = async (id, body, files) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // get blog type by id
    const blog_types = await query(
      `SELECT * FROM blog_types WHERE id = '${id}' AND is_deleted = 0`
    );

    // get current time
    const updated_at = getCurrentDateTime();

    // get all meta fields and assign it to variables
    const meta_title = body.meta_title || blog_types[0].meta_title;
    const meta_description =
      body.meta_description || blog_types[0].meta_description;
    const keywords = body.keywords || blog_types[0].keywords;
    const tags = body.tags || blog_types[0].tags;
    const og_title = body.og_title || blog_types[0].og_title;
    const og_description = body.og_description || blog_types[0].og_description;
    const structured_data =
      body.structured_data || blog_types[0].structured_data;
    // *************************************************************

    // get all files and it's alt value fron upcoming body and files
    let og_image = files?.get("og_image") || blog_types[0].og_image;
    let og_alt = body?.og_alt || blog_types[0].og_alt;
    // ****************************************************************

    // if files contain any media files then gose into the if condition
    if (Array.from(files.keys()).length) {
      //

      // check files have og_image or not

      if (files?.get("og_image") && !body?.og_alt) {
        message = "Alt tag is required for og image";
        code = 400;
        data = [];

        return { message, data, code };
      }

      if (files?.get("og_image") && body?.og_alt) {
        // upload files here
        let response = await uploadSingle(og_image, "blogTypes");

        if (response.code == 201 && response.data != null) {
          og_image = response.data;
        } else return response;
      }

      //
    }

    // pre-define the response values
    (message = "Error in updating blog type"), (code = 400);

    // update blog type : SQL query
    const blogType = await query(
      `UPDATE blog_types SET name = ?, meta_title = ?, meta_description = ?, keywords = ?, structured_data = ?, tags = ?, og_title = ?, og_description = ?, og_image = ?, og_alt = ?, updated_at = ? WHERE id = ?`,
      [
        body.name,
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

    if (blogType.affectedRows) {
      message = "Blog type updated successfully!";
      data = blogType;
      code = 200;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

//Function to delete blog type
export const delete_blog_type = async (id) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define response message
    (message = "Error in deleting blog type"), (code = 400);

    // soft delete the blog type
    const blogType = await query(
      `UPDATE blog_types SET is_deleted = 1 WHERE id = '${id}'`
    );

    if (blogType.affectedRows) {
      message = "Blog Type deleted successfully!";
      code = 200;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};
