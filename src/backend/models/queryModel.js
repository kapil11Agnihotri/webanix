// import npm packages
import { v4 as uuidv4 } from "uuid";

// import some custom modules
import { query } from "@/backend/config/db";
import { getCurrentDateTime } from "@/backend/helpers/commonHelper";
import { uploadSingle } from "@/backend/helpers/fileUploadHelper";

//Function to get queries
export const get_queries = async () => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define response message
    (message = "No queries found"), (code = 404);

    // get all queries
    const queries = await query(
      `SELECT * FROM queries ORDER BY created_at DESC`
    );

    if (queries.length) {
      message = "Queries fetched successfully!";
      code = 200;
      data = queries;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

//Function to get query by id
export const get_by_id = async (id) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define response message
    (message = "No queries found"), (code = 404);

    // get queries by id
    const queries = await query(`SELECT * FROM queries WHERE id = ?`, [id]);

    if (queries.length) {
      message = "Query fetched successfully";
      code = 200;
      data = queries[0];
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

//Function to get query by type
export const get_by_type = async (type) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define response message
    (message = "No queries found"), (code = 404);

    // get queries by types
    const queries = await query(
      `SELECT * FROM queries WHERE query_type = '${type}'`
    );

    if (queries.length) {
      message = "Queries fetched successfully!";
      code = 200;
      data = queries;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

//Function to store query
export const store = async (body, files) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // define id and current time
    const uuid = uuidv4();
    const createdAt = getCurrentDateTime();

    // get the upcoming body here
    const name = body?.name || null;
    const email = body?.email || null;
    const mobile = body?.mobile || null;
    const company_name = body?.company_name || null;
    const designation = body?.designation || null;
    const company_size = body?.company_size || null;
    const location = body?.location || null;
    const body_message = body?.message || null;
    const query_type = body?.query_type || null;
    const is_agree = body?.is_agree || null;
    const linkedin = body?.linkedin || null;
    const current_ctc = body?.current_ctc || null;
    const excepted_ctc = body?.excepted_ctc || null;
    const notice_period = body?.notice_period || null;
    const experience = body?.experience || null;

    let document = null;

    // if files contain files then gose into the if condition
    if (Array.from(files.keys()).length) {
      // upload files here
      let response = await uploadSingle(files?.get("document"), "queries");

      if (response.code === 201 && response.data != null) {
        document = response.data;
      } else return response;

      //
    }

    // pre-define the response values
    (message = "Error in creating query"), (code = 400);

    // Insert query
    let result = await query(
      `INSERT INTO queries(id, name, email, mobile, company_name, designation, company_size, location, message, document, linkedin, excepted_ctc, current_ctc, notice_period, experience, query_type, is_agree, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        uuid,
        name,
        email,
        mobile,
        company_name,
        designation,
        company_size,
        location,
        body_message,
        document,
        linkedin,
        excepted_ctc,
        current_ctc,
        notice_period,
        experience,
        query_type,
        is_agree,
        createdAt,
        createdAt,
      ]
    );

    if (result) {
      result.insertId = uuid;
      message = "Query created successfully";
      data = result;
      code = 201;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

//Function to delete query
export const delete_query = async (id) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define response message
    (message = "Error in deleting query"), (code = 400);

    // parmanent delete the queries
    let query = await query(`DELETE FROM queries WHERE id = '${id}'`);

    if (query.affectedRows) {
      message = "Query deleted successfully!";
      data = query;
      code = 200;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};
