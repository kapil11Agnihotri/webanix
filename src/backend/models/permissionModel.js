// import npm packages
import { v4 as uuidv4 } from "uuid";

// import some custom modules
import { query } from "@/backend/config/db";
import { getCurrentDateTime } from "@/backend/helpers/commonHelper";

// function return all permissions
export const get_permissions = async () => {
  let message = "Something went wrong",
    code = 500,
    data = null;

  try {
    // pre-define response message
    (message = "No permissions found"), (code = 404);

    // get all permissions
    const permissions = await query(
      `SELECT * FROM permissions ORDER BY created_at DESC`
    );

    if (permissions.length) {
      message = "Permission list fetched successfully!";
      code = 200;
      data = permissions;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// function return permission by id
export const get_permission_by_id = async (id) => {
  let message = "Something went wrong",
    code = 500,
    data = null;

  try {
    // pre-define response message
    (message = "No permission found"), (code = 404);

    // get permissions by id
    const permission = await query(
      `SELECT * FROM permissions WHERE id = '${id}'`
    );

    if (permission.length) {
      message = "permission fetched successfully!";
      code = 200;
      data = permission[0];
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// function store the new permission
export const store = async (body) => {
  let message = "Something went wrong",
    code = 500,
    data = null;

  try {
    // define id and current time
    const id = uuidv4();
    const createdAt = getCurrentDateTime();

    // pre-define the response values
    (message = "Error in creating permission"), (code = 400);

    // Insert query
    const result = await query(
      `INSERT INTO permissions(id, name, action, created_at, updated_at) VALUES (?,?,?,?,?)`,
      [id, body.name, body.action, createdAt, createdAt]
    );

    if (result) {
      message = "Permission created successfully!";
      data = result;
      code = 201;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

// function update permission by id
export const update = async (id, body) => {
  let message = "Something went wrong",
    code = 500,
    data = null;

  try {
    const createdAt = getCurrentDateTime();

    (message = "Error in updating permission"), (code = 400);

    const result = await query(
      `UPDATE permissions SET name = ?,action = ?,updated_at = ? WHERE id = ?`,
      [body.name, body.action, createdAt, id]
    );

    if (result) {
      message = "Permission updated successfully!";
      data = result;
      code = 201;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

// function return permission by name
export const get_permission_by_name = async (body) => {
  const permission = await query(
    `SELECT * FROM permissions WHERE name = '${body.name}' AND action = '${body.action}'`
  );

  return permission;
};

// function return permission by name but id is not same
export const get_permission_by_name_except_id = async (body) => {
  const permission = await query(
    `SELECT * FROM permissions WHERE name = '${body.name}' AND action = '${body.action}' AND id != '${body.id}'`
  );

  return permission;
};

// function return distinct permission name
export const get_distinct_name = async () => {
  let message = "Something went wrong",
    code = 500,
    data = null;

  try {
    // pre-define the response values
    (message = "Error in updating permission"), (code = 400);

    // get distinct name
    const result = await query(`SELECT DISTINCT(name) FROM permissions`, []);

    if (result) {
      message = "Permission fetched successfully!";
      data = result;
      code = 201;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};
