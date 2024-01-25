// import npm packages
import { v4 as uuidv4 } from "uuid";

// import some custom modules
import { query } from "@/backend/config/db";
import { getCurrentDateTime } from "@/backend/helpers/commonHelper";

// Function return users has this particular permissions
export const get_users_by_permission = async (permission_id) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define the response values
    (message = "No user permissions found"), (code = 404);

    // get by id
    const userPermissions = await query(
      `SELECT * FROM user_has_permissions WHERE permission_id = ?`,
      [permission_id]
    );

    if (userPermissions.length) {
      message = "User permission list fetched successfully!";
      code = 200;
      data = userPermissions;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// Function return permissions by users
export const get_permissions_by_user = async (user_id) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define the response values
    (message = "No user permissions found"), (code = 404);

    // get by user
    const userPermissions = await query(
      `SELECT permissions.name as name,permissions.action as action, permissions.id as id FROM user_has_permissions INNER JOIN permissions ON permissions.id = user_has_permissions.permission_id WHERE user_id = ?`,
      [user_id]
    );

    if (userPermissions.length) {
      message = "User permission list fetched successfully!";
      code = 200;
      data = userPermissions;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// Function return user permissions by id
export const get_user_permission_by_id = async (id) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define the response values
    (message = "No user permission found"), (code = 404);

    // get by user id
    const userPermission = await query(
      `SELECT * FROM user_has_permissions WHERE id = ?`,
      [id]
    );

    if (userPermission.length) {
      message = "User permission fetched successfully!";
      code = 200;
      data = userPermission;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// Function store permissions by users
export const store = async (user_id, role_id, permission_id) => {
  let message = "Something went wrong",
    code = 500,
    data = {};

  try {
    // define id and current time
    const id = uuidv4();
    const createdAt = getCurrentDateTime();

    // pre-define the response values
    (message = "Error in creating user permission"), (code = 400);

    // Insert query
    const result = await query(
      `INSERT INTO user_has_permissions(id, user_id, role_id, permission_id, created_at, updated_at) VALUES (?,?,?,?,?,?)`,
      [id, user_id, role_id, permission_id, createdAt, createdAt]
    );

    if (result) {
      message = "User permission created successfully!";
      data = result;
      code = 201;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

// Function delete permissions
export const delete_user_permission = async (user_id) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define the response values
    (message = "Error in deleting user permission"), (code = 400);

    // parmanent delete the user has permissions
    const result = await query(
      `DELETE FROM user_has_permissions WHERE user_id = ?`,
      [user_id]
    );

    if (result) {
      message = "User permission deleted successfully!";
      data = result;
      code = 200;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};
