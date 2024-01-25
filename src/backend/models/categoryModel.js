// import npm packages
import { v4 as uuidv4 } from "uuid";

// import some custom modules
import { query } from "@/backend/config/db";
import { getCurrentDateTime } from "@/backend/helpers/commonHelper";
import { uploadSingle } from "@/backend/helpers/fileUploadHelper";
import * as commonQueryModel from "@/backend/models/commonQueryModel";

//Function to get category list
export const get_category_list = async () => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define response message
    (message = "No category found"), (code = 404);

    // get category
    const category = await query(
      `SELECT * FROM categories WHERE is_deleted = ? ORDER BY created_at DESC`,
      [0]
    );

    if (category.length) {
      message = "category list fetched successfully!";
      code = 200;
      data = category;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

//Function to get category by id
export const get_category_by_id = async (id) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define response message
    (message = "No category found"), (code = 404);

    // get category by id
    const category = await query(
      `SELECT * FROM categories WHERE id = ? AND is_deleted = ?`,
      [id, 0]
    );

    if (category.length) {
      message = "category list fetched successfully!";
      code = 200;
      data = category[0];
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

//Function to get category by slug
export const get_category_list_by_slug = async (slug) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    (message = "No category found"), (code = 404);

    // get category by id
    const categoryId = await commonQueryModel.get_specific_data_by_field("id", "categories", "slug", slug);

    // get service list by category id
    const serviceList = await query(
      `SELECT * FROM services WHERE category = ? AND is_deleted = ?`,
      [categoryId[0].id, 0]
    );

    // get category by slug
    const categoryList = await query(
      `SELECT * FROM categories WHERE slug = ? AND is_deleted = ?`,
      [slug, 0]
    );

    categoryList[0].serviceList = serviceList;

    if (categoryList.length) {
      message = "category list fetched successfully!";
      code = 200;
      data = categoryList;
    }

  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

//Function to create category
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
        let response = await uploadSingle(og_image, "categories");

        if (response.code === 201 && response.data != null) {
          og_image = response.data;
        } else return response;
      }

      // if we have featured_image or alt both then upload file
      if (featured_image && alt) {
        // upload files here
        let response = await uploadSingle(featured_image, "categories");

        if (response.code === 201 && response.data != null) {
          featured_image = response.data;
        } else return response;
      }

      //
    }
    // ****************************************************************

    // pre-define the response values
    (message = "Error in creating category"), (code = 400);

    // insert category : SQL query
    const category = await query(
      `INSERT INTO categories (id, title, slug, heading, content, featured_image, alt, meta_title, meta_description, keywords, structured_data, tags, og_title, og_description, og_image, og_alt, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        id,
        body.title,
        body.slug,
        body.heading,
        body.content,
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

    if (category.affectedRows) {
      category.insertId = id;
      message = "category created successfully!";
      data = category;
      code = 201;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

//Function to update category
export const update = async (id, body, files) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // get category by id
    const categories = await query(
      `SELECT * FROM categories WHERE id = '${id}' AND is_deleted = 0`
    );

    // get current time
    const updated_at = getCurrentDateTime();

    // get all meta fields and assign it to variables
    const meta_title = body.meta_title || categories[0].meta_title;
    const meta_description =
      body.meta_description || categories[0].meta_description;
    const keywords = body.keywords || categories[0].keywords;
    const tags = body.tags || categories[0].tags;
    const og_title = body.og_title || categories[0].og_title;
    const og_description = body.og_description || categories[0].og_description;
    const structured_data =
      body.structured_data || categories[0].structured_data;
    // *************************************************************

    // get all files and it's alt value fron upcoming body and files
    let og_image = files?.get("og_image") || categories[0].og_image;
    let og_alt = body?.og_alt || categories[0].og_alt;

    let featured_image =
      files?.get("featured_image") || categories[0].featured_image;
    let alt = body?.alt || categories[0].alt;

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
          "categories"
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
          "categories"
        );

        if (response.code === 201 && response.data != null) {
          featured_image = response.data;
        } else return response;
      }

      //
    }
    // ****************************************************************

    // pre-define the response values
    (message = "Error in updating category"), (code = 400);

    // update category : SQL query
    const category = await query(
      `UPDATE categories SET title = ?, slug = ?, heading = ?, content = ?, featured_image = ?, alt = ?, meta_title = ?, meta_description = ?, keywords = ?, structured_data = ?, tags = ?, og_title = ?, og_description = ?, og_image = ?, og_alt = ?, updated_at = ? WHERE id = ?`,
      [
        body.title,
        body.slug,
        body.heading,
        body.content,
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

    if (category.affectedRows) {
      message = "category updated successfully!";
      data = category;
      code = 200;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

//Function to delete category
export const delete_category = async (id) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define response message
    (message = "Error in deleting category"), (code = 400);

    // soft delete the category
    const category = await query(
      `UPDATE categories SET is_deleted = 1 WHERE id = '${id}'`
    );

    if (category.affectedRows) {
      message = "category deleted successfully!";
      code = 200;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};
