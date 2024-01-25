// import npm packages
import { v4 as uuidv4 } from "uuid";

// import some custom modules
import { query } from "@/backend/config/db";
import { getCurrentDateTime } from "@/backend/helpers/commonHelper";

// function return user roles
export const get_list = async () => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define the response values
    (message = "No user roles found"), (code = 404), (data = []);

    // get all
    const userHasRoles = await query(`SELECT * FROM user_has_roles`);

    if (userHasRoles.length) {
      message = "User Role list fetched successfully!";
      code = 200;
      data = userHasRoles;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// function return user by roles
export const get_users_by_role = async (role_id) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define the response values
    (message = "No user roles found"), (code = 404), (data = []);

    // get by role id
    const userHasRoles = await query(
      `SELECT * FROM user_has_roles WHERE role_id = ?`,
      [role_id]
    );

    if (userHasRoles.length) {
      message = "User Role list fetched successfully!";
      code = 200;
      data = userHasRoles;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// function return roles by users
export const get_roles_by_user = async (user_id) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define the response values
    (message = "No user roles found"), (code = 404), (data = []);

    // get by userid
    const userHasRoles = await query(
      `SELECT * FROM user_has_roles WHERE user_id = ?`,
      [user_id]
    );

    if (userHasRoles.length) {
      message = "User Role list fetched successfully";
      code = 200;
      data = userHasRoles;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// function store new user roles
export const store = async (user_id, role_id) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // define id and current time
    const id = uuidv4();
    const createdAt = getCurrentDateTime();

    // pre-define the response values
    (message = "Error in creating user role"), (code = 400);

    // Insert query
    const result = await query(
      `INSERT INTO user_has_roles(id, user_id, role_id, created_at, updated_at) VALUES (?,?,?,?,?)`,
      [id, user_id, role_id, createdAt, createdAt]
    );

    if (result) {
      message = "User Role created successfully";
      data = result;
      code = 201;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

// function delete user role
export const delete_user_role = async (user_id, role_id) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define the response values
    (message = "Error in deleting user role"), (code = 400);

    // parmanent delete
    const result = await query(
      `DELETE FROM user_has_roles WHERE user_id = ? AND role_id = ?`,
      [user_id, role_id]
    );

    if (result) {
      message = "User Role deleted successfully";
      data = result;
      code = 201;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};
