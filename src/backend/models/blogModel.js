// import npm packages
import { v4 as uuidv4 } from "uuid";

// import some custom modules
import { query } from "@/backend/config/db";
import { getCurrentDateTime } from "@/backend/helpers/commonHelper";
import { uploadSingle } from "../helpers/fileUploadHelper";

//Function to get blogs list
export const get_blogs = async () => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define the resonse message
    (message = "No blogs found"), (code = 404);

    // get all non deleted blogs
    const blogs = await query(
      `SELECT blogs.*, blog_types.name AS blog_type_name FROM blogs LEFT JOIN blog_types ON blogs.blog_type = blog_types.id WHERE blogs.is_deleted = 0 ORDER BY created_at DESC;`
    );

    if (blogs.length) {
      message = "Blogs list fetched successfully!";
      code = 200;
      data = blogs;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

//Function to get blogs list
export const get_published_blog_list = async (status) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // get status code value else set by defalut value to 2
    const status_code = status || 2;

    // pre-define the response message
    (message = "No blogs found"), (code = 404);

    // get all blogs where status equal to upcoming code code
    const blogs = await query(
      `SELECT blogs.*, blog_types.name AS blog_type_name FROM blogs LEFT JOIN blog_types ON blogs.blog_type = blog_types.id WHERE blogs.is_deleted = 0 AND blogs.status = ? ORDER BY created_at DESC;`,
      [status_code]
    );

    if (blogs.length) {
      message = "Blogs list fetched successfully!";
      code = 200;
      data = blogs;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

//Function to get blog by id
export const get_blog_by_id = async (id) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define the response message
    (message = "No blog found"), (code = 404);

    // get blogs where id equal to upcoming id
    const blogs = await query(
      `SELECT * FROM blogs WHERE id = '${id}' AND is_deleted = 0`
    );

    if (blogs.length) {
      message = "Blog fetched successfully!";
      code = 200;
      data = blogs[0];
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

//Function to get blog by slug
export const get_blog_by_slug = async (slug) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define the response message
    (message = "No blog found"), (code = 404);

    // get blog according to slug value
    const blogs = await query(
      `SELECT blogs.*, blog_types.name AS blog_type_name FROM blogs LEFT JOIN blog_types ON blogs.blog_type = blog_types.id WHERE blogs.slug = '${slug}' AND blogs.is_deleted = 0 ORDER BY created_at DESC;`
    );

    if (blogs.length) {
      message = "Blog fetched successfully!";
      code = 200;
      data = blogs[0];
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

//Function to create blog
export const store = async (body, files) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // define id and current time
    const id = uuidv4();
    const createdAt = getCurrentDateTime();

    // to create publish date
    let date = new Date().toLocaleDateString("en-IN");
    date = date.split("/").reverse().join("-");

    const publish_date = body.publish_date || date;
    // ****************************************************************

    // get all upcoming meta related values from body
    const meta_title = body.meta_title || null;
    const meta_description = body.meta_description || null;
    const keywords = body.keywords || null;
    const tags = body.tags || null;
    const og_title = body.og_title || null;
    const og_description = body.og_description || null;
    const structured_data = body.structured_data || null;
    const status = body.status || 2;

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
        let response = await uploadSingle(og_image, "blogs");

        if (response.code === 201 && response.data != null) {
          og_image = response.data;
        } else return response;
      }

      // if we have featured_image or alt both then upload file
      if (featured_image && alt) {
        // upload files here
        let response = await uploadSingle(featured_image, "blogs");

        if (response.code === 201 && response.data != null) {
          featured_image = response.data;
        } else return response;
      }

      //
    }
    // ****************************************************************

    // pre-define the response values
    (message = "Error in creating blog"), (code = 400);

    // insert blogs : SQL query
    const blogs = await query(
      `INSERT INTO blogs (id, slug, title, description, short_description, featured_image, alt, blog_tags, meta_title, meta_description, keywords, structured_data, tags, og_title, og_description, og_image, og_alt, publish_date, status, blog_type, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        id,
        body?.slug,
        body?.title,
        body?.description,
        body?.short_description,
        featured_image,
        alt,
        body?.blog_tags,
        meta_title,
        meta_description,
        keywords,
        structured_data,
        tags,
        og_title,
        og_description,
        og_image,
        og_alt,
        publish_date,
        status,
        body?.blog_type,
        createdAt,
        createdAt,
      ]
    );

    if (blogs.affectedRows) {
      blogs.insertId = id;
      message = "Blog created successfully!";
      data = blogs;
      code = 201;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

//Function to update blog
export const update = async (id, body, files) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // get blog by id
    const blog = await query(
      `SELECT * FROM blogs WHERE id = '${id}' AND is_deleted = 0`
    );

    // get current time
    const updated_at = getCurrentDateTime();

    // to create publish date
    let date = new Date().toLocaleDateString("pt-PT");
    date = date.split("/").reverse().join("-");

    const publish_date = body.publish_date || date;
    // **************************************************************

    // get all meta fields and assign it to variables
    const meta_title = body.meta_title || blog[0]["meta_title"];
    const meta_description =
      body.meta_description || blog[0]["meta_description"];
    const keywords = body.keywords || blog[0]["keywords"];
    const tags = body.tags || blog[0]["tags"];
    const og_title = body.og_title || blog[0]["og_title"];
    const og_description = body.og_description || blog[0]["og_description"];
    const structured_data = body.structured_data || blog[0]["structured_data"];
    // *************************************************************

    const status = body.status || blog[0]["status"];

    // get all files and it's alt value fron upcoming body and files
    let og_image = files?.get("og_image") || blog[0].og_image;
    let og_alt = body?.og_alt || blog[0].og_alt;

    let featured_image = files?.get("featured_image") || blog[0].featured_image;
    let alt = body?.alt || blog[0].alt;

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
          "blogs"
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
          "blogs"
        );

        if (response.code === 201 && response.data != null) {
          featured_image = response.data;
        } else return response;
      }

      //
    }
    // ****************************************************************

    // pre-define the response values
    (message = "Error in updating blog type"), (code = 400);

    // update blog : SQL query
    const blogs = await query(
      `UPDATE blogs SET slug = ?, title = ?, description = ?, short_description = ?, featured_image = ?, alt = ?, blog_tags = ?, meta_title = ?, meta_description = ?, keywords = ?, structured_data = ?, tags = ?, og_title = ?, og_description = ?, og_image = ?, og_alt = ?, publish_date = ?, status = ?, blog_type = ?, updated_at = ? WHERE id = ?`,
      [
        body.slug,
        body.title,
        body.description,
        body.short_description,
        featured_image,
        alt,
        body?.blog_tags,
        meta_title,
        meta_description,
        keywords,
        structured_data,
        tags,
        og_title,
        og_description,
        og_image,
        og_alt,
        publish_date,
        status,
        body?.blog_type,
        updated_at,
        id,
      ]
    );

    if (blogs.affectedRows) {
      message = "Blog updated successfully!";
      data = blogs;
      code = 200;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

//Function to delete blog
export const delete_blog = async (id) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define response message
    (message = "Error in deleting blog"), (code = 400);

    // soft delete the blog
    const blogs = await query(
      `UPDATE blogs SET is_deleted = 1 WHERE id = '${id}'`
    );

    if (blogs.affectedRows) {
      message = "Blog deleted successfully!";
      data = blogs;
      code = 200;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

//Function to changes blog status
export const change_blog_status = async (id, params) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define the satuts code and get the current time
    let status_code, status;
    const updated_at = getCurrentDateTime();

    switch (params.status) {
      case 0:
        status_code = 0;
        status = "Draft";
        break;
      case 1:
        status_code = 1;
        status = "Pending";
        break;
      case 2:
        status_code = 2;
        status = "Published";
        break;
      default:
        message = "Please enter valid status code";
        code = 400;
        return { message, code };
    }

    // pre-define response message
    (message = "Error in changing blog status"), (code = 400);

    // update the status value
    const result = await query(
      `UPDATE blogs SET status = ?, updated_at = ? 
         WHERE id = ?`,
      [status_code, updated_at, id]
    );

    if (result.affectedRows) {
      message = `Blog status chnaged to ${status}!`;
      data = result;
      code = 200;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};
