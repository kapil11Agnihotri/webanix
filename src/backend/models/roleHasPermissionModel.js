// import npm packages
import { v4 as uuidv4 } from "uuid";

// import some custom modules
import { query } from "@/backend/config/db";
import { getCurrentDateTime } from "@/backend/helpers/commonHelper";

// function return permissions by role
export const get_permisssions_by_role = async (role_id) => {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    // pre-define the response values
    (message = "No data found"), (code = 404);

    // get by role id
    const roleHasPermissions = await query(
      `SELECT * FROM role_has_permissions WHERE role_id = ?`,
      [role_id]
    );

    if (roleHasPermissions.length) {
      message = "Role Permission list fetched successfully!";
      code = 200;
      data = roleHasPermissions;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// function store permissions
export const store_role_permission = async (body) => {
  let message = "Something went wrong",
    code = 500,
    data = null;

  try {
    // define id and current time
    const id = uuidv4();
    const createdAt = getCurrentDateTime();

    // pre-define the response values
    (message = "Error in creating role"), (code = 400);

    // Insert query
    const roleHasPermission = await query(
      `INSERT INTO role_has_permissions(id, role_id, permission_id, created_at, updated_at) VALUES (?,?,?,?,?)`,
      [id, body.role_id, body.permission_id, createdAt, createdAt]
    );

    if (roleHasPermission) {
      message = "Role permission created successfully!";
      data = roleHasPermission;
      code = 201;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

// function delete role
export const delete_role_permission = async (id) => {
  let message = "Something went wrong",
    code = 500,
    data = null;

  try {
    // pre-define the response values
    (message = "Error in deleting role"), (code = 400);

    // parmanent delete the role has permissions
    const result = await query(
      `DELETE FROM role_has_permissions WHERE id = ?`,
      [id]
    );

    if (result) {
      message = "Permission deleted successfully!";
      code = 200;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};
