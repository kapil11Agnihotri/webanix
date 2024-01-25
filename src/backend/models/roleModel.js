// import npm packages
import { v4 as uuidv4 } from "uuid";

// import some custom modules
import { query } from "@/backend/config/db";
import { getCurrentDateTime } from "@/backend/helpers/commonHelper";

// function return all roles
export const get_roles = async () => {
  let message = "Something went wrong",
    code = 500,
    data = null;

  try {
    // pre-define the response values
    (message = "No roles found"), (code = 404);

    // get roles
    const roles = await query(`SELECT * FROM roles ORDER BY created_at DESC`);

    if (roles.length) {
      message = "Role list fetched successfully!";
      code = 200;
      data = roles;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// function return role by id
export const get_role_by_id = async (id) => {
  let message = "Something went wrong",
    code = 500,
    data = null;

  try {
    // pre-define the response values
    (message = "No role found"), (code = 404);

    // get role by id
    const role = await query(`SELECT * FROM roles WHERE id = ?`, [id]);

    if (role.length) {
      message = "Role fetched successfully!";
      code = 200;
      data = role[0];
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// function return role by name
export const get_role_by_name = async (name) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define the response values
    (message = "No role found"), (code = 404);

    // get role by name
    const role = await query(`SELECT * FROM roles WHERE name = ?`, [name]);

    if (role.length) {
      message = "Role fetched successfully!";
      code = 200;
      data = role[0];
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// function store the new role
export const store = async (name) => {
  let message = "Something went wrong",
    code = 500,
    data = null;

  try {
    // define id and current time
    const id = uuidv4();
    const createdAt = getCurrentDateTime();

    // pre-define the response values
    (message = "Error in creating role"), (code = 400);

    // Insert into table : query
    const result = await query(
      `INSERT INTO roles(id, name, created_at, updated_at) VALUES (?,?,?,?)`,
      [id, name, createdAt, createdAt]
    );

    if (result) {
      message = "Role created successfully!";
      data = result;
      code = 201;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

// function update role by id
export const update = async (id, name) => {
  let message = "Something went wrong",
    code = 500,
    data = null;

  try {
    // define id and current time
    const createdAt = getCurrentDateTime();

    // pre-define the response values
    (message = "Error in updating role"), (code = 400);

    // Update query
    const result = await db.query(
      `UPDATE roles SET name = ?,updated_at = ? WHERE id = ?`,
      [name, createdAt, id]
    );

    if (result) {
      message = "Role updated successfully";
      data = result;
      code = 201;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};
