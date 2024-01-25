// import npm packages
import { v4 as uuidv4 } from "uuid";

// import some custom modules
import { query } from "@/backend/config/db";
import { getCurrentDateTime } from "@/backend/helpers/commonHelper";
import { uploadSingle } from "../helpers/fileUploadHelper";

// get pages list
export const get_pages = async () => {
  let message = "Something went wrong at pageModel",
    code = 500,
    data = null;

  try {
    // pre-define response message
    (message = "No pages found"), (code = 404);

    // get pages
    const pages = await query(`SELECT * FROM pages WHERE is_deleted = 0`);

    if (pages.length) {
      message = "Pages list fetched successfully!";
      code = 200;
      data = pages;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// get active pages list
export const get_active_pages_list = async () => {
  let message = "Something went wrong",
    code = 500,
    data = null;

  try {
    // pre-define response message
    (message = "No pages found"), (code = 404);

    // get active page list
    const pages = await query(
      `SELECT * FROM pages WHERE is_active = 0 AND is_deleted = 0`
    );

    if (pages.length) {
      message = "Pages list fetched successfully!";
      code = 200;
      data = pages;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// get pages by id
export const get_pages_by_id = async (id) => {
  let message = "Something went wrong",
    code = 500,
    data = null;

  try {
    // pre-define response message
    (message = "No page found"), (code = 404);

    // get pages by id
    const pages = await query(
      `SELECT * FROM pages WHERE id = ? AND is_deleted = ?`,
      [id, 0]
    );


    if (pages.length) {
      message = "Page fetched successfully!";
      code = 200;
      data = pages[0];
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// get pages by slug
export const get_pages_by_slug = async (slug) => {
  let message = "Something went wrong",
    code = 500,
    data = null;

  try {
    // pre-define response message
    (message = "No page found"), (code = 404), (data = []);

    // get pages by slug
    const pages = await query(
      `SELECT * FROM pages WHERE slug = '${slug}' AND is_deleted = 0`
    );


    if (pages.length) {
      message = "Page fetched successfully!";
      code = 200;
      data = pages[0];
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// create pages
export const store_page = async (body, files, userId) => {
  var message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // define id and current time
    const uuid = uuidv4();
    const created_at = getCurrentDateTime();

    const is_active = body.is_active || "0";
    const excerpt = body.excerpt || null;
    const page_json = JSON.stringify(body.page_json);

    // get all upcoming meta related values from body
    const meta_title = body.meta_title || null;
    const meta_description = body.meta_description || null;
    const keywords = body.keywords || null;
    const tags = body.tags || null;
    const og_title = body.og_title || null;
    const og_description = body.og_description || null;
    const structured_data = body.structured_data || null;
    // **************************************************************

    // get all files and it's alt value fron upcoming body and files
    let og_image = files?.get("og_image") || null;
    let og_alt = body?.og_alt || null;

    let featured_image = files?.get("featured_image") || null;
    let alt = body?.alt || null;

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

      // if we have or_image or og_alt both then upload file
      if (og_image && og_alt) {
        // upload files here
        let response = await uploadSingle(og_image, "pages");

        if (response.code === 201 && response.data != null) {
          og_image = response.data;
        } else return response;
      }

      // if we have featured_image or alt both then upload file
      if (featured_image && alt) {
        // upload files here
        let response = await uploadSingle(featured_image, "pages");

        if (response.code === 201 && response.data != null) {
          featured_image = response.data;
        } else return response;
      }

      //
    }
    // ****************************************************************

    // pre-define the response values
    (message = "Error in creating page"), (code = 400), (data = {});

    // insert page : SQL query
    const result = await query(
      `INSERT INTO pages(id, name, slug, template_type, featured_image, alt, page_json, last_updated_by, meta_title, meta_description, keywords, tags, og_title, og_description, og_image, og_alt, structured_data, excerpt, is_active, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        uuid,
        body.name,
        body.slug,
        body.template_type,
        featured_image,
        alt,
        page_json,
        userId,
        meta_title,
        meta_description,
        keywords,
        tags,
        og_title,
        og_description,
        og_image,
        og_alt,
        structured_data,
        excerpt,
        is_active,
        created_at,
        created_at,
      ]
    );

    if (result) {
      result.insertId = uuid;
      message = "Page created successfully!";
      data = result;
      code = 201;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

// update pages
export const update_page = async (id, body, files, userId) => {
  let message = "Something went wrong",
    code = 500,
    data = null;

  try {
    // get page by id
    const page = await query(
      `SELECT * FROM pages WHERE id = '${id}' AND is_deleted = 0`
    );

    // get current time
    const created_at = getCurrentDateTime();

    const is_active = body.is_active || "0";
    const excerpt = body.excerpt || page[0].excerpt;
    const page_json = body.page_json
      ? JSON.stringify(body.page_json)
      : page[0].page_json;

    // get all meta fields and assign it to variables
    const meta_title = body.meta_title || page[0].meta_title;
    const meta_description = body.meta_description || page[0].meta_description;
    const keywords = body.keywords || page[0].keywords;
    const tags = body.tags || page[0].tags;
    const og_title = body.og_title || page[0].og_title;
    const og_description = body.og_description || page[0].og_description;
    const structured_data = body.structured_data
      ? JSON.stringify(body.structured_data)
      : page[0].structured_data;
    // *************************************************************

    // get all files and it's alt value fron upcoming body and files
    let og_image = files?.get("og_image") || page[0].og_image;
    let og_alt = body?.og_alt || page[0].og_alt;

    let featured_image = files?.get("featured_image") || page[0].featured_image;
    let alt = body?.alt || page[0].alt;

    // if files contain any media files then gose into the if condition
    if (Array.from(files.keys()).length) {
      //

      // check og_image have og_alt or not
      if (files?.get("og_image") && !body?.og_alt) {
        message = "Alt tag is required for og image";
        code = 400;
        data = [];

        return { message, data, code };
      }

      // check featured_image have alt or not
      if (files?.get("featured_image") && !body?.alt) {
        message = "Alt tag is required for featured image";
        code = 400;
        data = [];

        return { message, data, code };
      }

      // if we have or_image or og_alt both then upload file
      if (files?.get("og_image") && body?.og_alt) {
        // upload files here
        let response = await uploadSingle(
          files?.get("og_image"),
          "pages"
        );

        if (response.code === 201 && response.data != null) {
          og_image = response.data;
        } else return response;
      }

      // if we have featured_image or alt both then upload file
      if (files?.get("featured_image") && body?.alt) {
        // upload files here
        let response = await uploadSingle(
          files?.get("featured_image"),
          "pages"
        );

        if (response.code === 201 && response.data != null) {
          featured_image = response.data;
        } else return response;
      }

      //
    }
    // ****************************************************************

    // pre-define the response values
    (message = "Error in updating page"), (code = 400), (data = {});

    // update page : SQL query
    const result = await query(
      `UPDATE pages SET name = ?, slug = ?, template_type = ?, featured_image = ?, alt = ?, page_json = ?, last_updated_by = ?, meta_title = ?, meta_description = ?, keywords = ?, tags = ?, og_title = ?, og_description = ?, og_image = ?, og_alt = ?, structured_data = ?, excerpt = ?, is_active = ?, updated_at = ? WHERE id = ?`,
      [
        body.name,
        body.slug,
        body.template_type,
        featured_image,
        alt,
        page_json,
        userId,
        meta_title,
        meta_description,
        keywords,
        tags,
        og_title,
        og_description,
        og_image,
        og_alt,
        structured_data,
        excerpt,
        is_active,
        created_at,
        id,
      ]
    );

    if (result) {
      message = "Page updated successfully!";
      code = 201;
      data = result;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

// delete pages
export const delete_page = async (id) => {
  let message = "Something went wrong",
    code = 500;

  try {
    // pre-define response message
    (message = "Error in deleting pages"), (code = 400);

    // soft delete the page
    const result = await query(
      `UPDATE pages set is_deleted = 1 WHERE id = '${id}'`
    );

    if (result) {
      message = "Page deleted successfully";
      code = 200;
    }
  } catch (error) {
    message = error;
  }

  return { message, code };
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
      let response = await uploadSingle(files?.get("image"), "pages");

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
