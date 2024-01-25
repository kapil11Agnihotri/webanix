// import npm packages
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// import some custom modules
import { query } from '@/backend/config/db';
import { getCurrentDateTime } from '@/backend/helpers/commonHelper';

import * as commonQueryModel from "@/backend/models/commonQueryModel";
import * as userHasRoleModel from "@/backend/models/userHasRoleModel";
import * as userHasPermissionModel from "@/backend/models/userHasPermissionModel";
import * as roleHasPermissionModel from "@/backend/models/roleHasPermissionModel";

// Find the users
export const get_users = async () => {
  let message = 'Something went wrong',
    code = 500,
    data = [];

  try {
    // pre-define the response values
    (message = 'No users found'), (code = 404), (data = []);

    // get all
    const users = await query(
      `SELECT users.*, roles.name as role_name FROM users inner join roles on roles.id = users.role_id WHERE is_active = 1 AND is_deleted = 0 ORDER BY created_at DESC`,
      []
    );

    if (users.length) {
      message = 'User list fetched successfully!';
      code = 200;
      data = users;
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// Find the user by their id
export const get_user_by_id = async (id) => {
  let message = 'Something went wrong!',
    code = 500,
    data = [];

  try {
    // pre-define the response values
    (message = "User is not found!"), (code = 404);

    const response = await query(
      `SELECT users.*, roles.name as role_name FROM users inner join roles on roles.id = users.role_id WHERE users.id = ? AND users.is_deleted = 0`,
      [id]
    );

    if (response.length > 0) {
      message = 'User is found Successfully!';
      code = 200;
      data = response[0];
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// Find the user by their email
export const get_user_by_email = async (email) => {
  let message = 'Something went wrong!',
    code = 500,
    data = [];

  try {
    // pre-define the response values
    (message = 'User is not found!'), (code = 204), (data = null);

    const response = await query(
      `SELECT users.*, roles.name as role_name FROM users LEFT JOIN roles ON users.role_id = roles.id WHERE email = ?`,
      [email]
    );

    if (response.length > 0) {
      message = 'User is found Successfully!';
      code = 200;
      data = response[0];
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// Store the new user into the dataBase
export const store = async (body) => {
  let message = 'Something went wrong',
    code = 500,
    data = [];

  try {
    // get id and current time
    const id = uuidv4();
    const timestamp = getCurrentDateTime();

    const { name, email, password, role_id } = body;
    const bycrptedPassword = await bcrypt.hash(password, 8);

    // pre-define the response values
    (message = 'Error in creating user'), (code = 404);

    // insert the new user's detail in the database
    const response = await query(
      'INSERT INTO users( id, name, email, password, role_id, created_at, updated_at) VALUES (?,?,?,?,?,?,?)',
      [id, name, email, bycrptedPassword, role_id, timestamp, timestamp]
    );

    if (response.affectedRows) {
      await userHasRoleModel.store(id, role_id);

      const roleHasPermissions =
        await roleHasPermissionModel.get_permisssions_by_role(role_id);

      if (roleHasPermissions?.data.length > 0) {
        //

        roleHasPermissions?.data?.map(async (roleHasPermission) => {
          await userHasPermissionModel.store(
            id,
            role_id,
            roleHasPermission.permission_id
          );
        });

        //
      }

      message = 'User is created successfully!';
      code = 201;
      data = {
        userId: id,
        name: name,
        email: email,
      };
    }
  } catch (error) {
    message = error;
  }

  return { message, code, data };
};

// Update user into the dataBase
export const update = async (id, body) => {
  let message = 'Something went wrong',
    code = 500,
    data = [];

  try {
    const createdAt = getCurrentDateTime();

    (message = 'Error in updating user'), (code = 404), (data = []);

    if (!body.password) {
      let password = await commonQueryModel.get_specific_data_by_field(
        'password',
        'users',
        'id',
        id
      );
      body.password = password[0].password;
    } else {
      const bycrptedPassword = await bcrypt.hash(body.password, 8);
      body.password = bycrptedPassword;
    }

    const result = await query(
      `UPDATE users SET name = ?, email = ?, password = ?, role_id = ?, updated_at= ? WHERE id = ?`,
      [body.name, body.email, body.password, body.role_id, createdAt, id]
    );

    if (result.affectedRows) {
      message = 'User updated successfully!';
      code = 200;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

// delete new user into the dataBase
export const delete_user = async (id) => {
  let message = 'Something went wrong',
    code = 500,
    data = [];

  try {
    // current time
    const createdAt = getCurrentDateTime();

    // pre-define the response values
    (message = 'Error in deleting user'), (code = 404), (data = []);

    // update query
    const result = await query(
      `UPDATE users SET is_Active = ?, is_deleted = ?, updated_at= ? WHERE id = ?`,
      [0, 1, createdAt, id]
    );

    if (result.affectedRows) {
      message = 'User Deleted Successfully';
      code = 200;
    }
  } catch (error) {
    message = error;
  }

  return { message, data, code };
};

// Set the otp value to specific user
export const update_otp = async (email, otp) => {
  let message = 'Something went wrong',
    code = 500;

  try {
    // get current time
    const timestamp = getCurrentDateTime();

    // update the opt value into database
    const response = await query(
      'UPDATE users SET otp = ?, updated_at = ? WHERE email = ?',
      [otp, timestamp, email]
    );

    if (response.affectedRows) {
      message = 'OTP is updated successfully!';
      code = 201;
    }
  } catch (error) {
    message = error;
  }

  return { message, code };
};

// update password
export const update_password_of_user = async (email, password) => {
  let message = 'Something went wrong',
    code = 500;

  try {
    // get current time
    const timestamp = getCurrentDateTime();

    // hash the new password
    const bycrptedPassword = await bcrypt.hash(password, 8);

    (message = 'Password is not update'), (code = 401);

    // insert the new user's detail in the database
    const response = await query(
      'UPDATE users SET password = ?, updated_at = ? WHERE email = ?',
      [bycrptedPassword, timestamp, email]
    );

    if (response.affectedRows) {
      message = 'Password is Updated!';
      code = 201;
    }
  } catch (error) {
    message = error;
  }

  return { message, code };
};
