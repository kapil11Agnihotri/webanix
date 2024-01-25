import { query } from "@/backend/config/db.js";

// get specific data by field
export const get_specific_data_by_field = async (col, table, field, value) => {
  const data = await query(
    `SELECT ${col} FROM ${table} WHERE ${field} = '${value}'`,
    []
  );

  return data;
};

// get data by field
export const get_data_by_field = async (table, field, value) => {
  const data = await query(
    `SELECT * FROM ${table} WHERE ${field} = '${value}'`,
    []
  );

  return data;
};

// get data by field but except deleted data
export const get_data_by_field_except_deleted = async (table, field, value) => {
  const data = await query(
    `SELECT * FROM ${table} WHERE ${field} = '${value}' AND is_deleted = 0`,
    []
  );

  return data;
};

// get data by field but except id
export const get_data_by_field_except_id = async (table, field, value, id) => {
  const data = await query(
    `SELECT * FROM ${table} WHERE ${field} = '${value}' AND id != '${id}'`,
    []
  );

  return data;
};

// get data by field but except deleted or id data
export const get_data_by_field_except_id_except_deleted = async (
  table,
  field,
  value,
  id
) => {
  const data = await query(
    `SELECT * FROM ${table} WHERE ${field} = '${value}' AND id != '${id}' AND is_deleted = 0`,
    []
  );

  return data;
};

// *******************************************************************
// optimized code define here
// *******************************************************************

export const data_exist_by_id = async (table, id) => {
  const data = await query(
    `SELECT COUNT(id) as exist FROM ${table} WHERE id = '${id}'`
  );

  return data[0];
};

export const data_exist_by_field_except_deleted = async (
  table,
  field,
  value
) => {
  const data = await query(
    `SELECT COUNT(id) as exist FROM ${table} WHERE ${field} = '${value}' AND is_deleted = 0`
  );

  return data[0];
};

export const data_exist_by_field_except_id_except_deleted = async (
  table,
  field,
  value,
  id
) => {
  const data = await query(
    `SELECT COUNT(id) as exist FROM ${table} WHERE ${field} = '${value}' AND id != '${id}' AND is_deleted = 0`
  );

  return data[0];
};
