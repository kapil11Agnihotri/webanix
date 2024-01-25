// import npm packages
import { v4 as uuidv4 } from "uuid";

// import some custom modules
import { query } from "@/backend/config/db";
import { getCurrentDateTime } from "@/backend/helpers/commonHelper";

// Find ths size of contacts according to the pages
export const get_contact_size_with_page = async () => {
  let message = "Something went wrong!",
    code = 500,
    data = null;

  try {
    // pre-define the response values
    (message = "Data not found"), (code = 404);

    const response = await query(
      `SELECT page, COUNT(id) as size FROM contacts GROUP BY page`
    );

    if (response.length) {
      message = "fetched successfully!";
      code = 200;
      data = response;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// get the contacts
export const get_contact = async (req) => {
  let message = "Something went wrong!",
    code = 500,
    data = null;

  try {
    // no of entry user want to fetch according to keywords
    let keyword = req?.nextUrl?.searchParams.get("keyword") ?? "";
    let entry = req?.nextUrl?.searchParams.get("entry") ?? 100;
    let offset = req?.nextUrl?.searchParams.get("offset") ?? 0;

    // pre-define the response values
    (message = "contacts not found"), (code = 404);

    const response = await query(
      `SELECT * FROM contacts WHERE name REGEXP ? OR email REGEXP ? LIMIT ? OFFSET ?`,
      [keyword, keyword, entry, offset * entry]
    );

    if (response.length) {
      message = "contacts fetched successfully!";
      code = 200;
      data = response;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// Store the new contact into the database
export const store = async (body) => {
  let message = "Something went wrong",
    code = 500,
    data = null;

  try {
    // get id and current time
    const id = uuidv4();
    const timestamp = getCurrentDateTime();

    // destructuring the body
    const { name, email, messageText } = body;

    // pre-define the response values
    (message = "contact is unable to create"), (code = 422);

    // inserting contact into the contact's table
    const response = await query(
      "INSERT INTO contacts (id, name, email, message,  created_at, updated_at) VALUES (?,?,?,?,?,?)",
      [id, name, email, messageText, timestamp, timestamp]
    );

    if (response.affectedRows) {
      message = "New contact is created successfully!";
      code = 201;
      data = response;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};
