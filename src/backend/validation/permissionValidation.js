import z from "zod";
import * as permissionModel from "@/backend/models/permissionModel.js";

// create permission validation
export const permissionCreateValidation = z
  .object({
    name: z
      .string({
        required_error: "Permission name is required",
        invalid_type_error: "Permission name must be a string",
      })
      .trim()
      .min(1, { message: "Permission name is required" }),

    action: z
      .string({
        required_error: "Permission action is required",
        invalid_type_error: "Permission action must be a string",
      })
      .trim()
      .min(1, { message: "Permission action is required" }),
  })
  .refine(
    async (values) => {
      let permission = await permissionModel.get_permission_by_name(values);

      if (permission[0]) return false;
      else return true;
    },
    {
      message: "Permission name and action already in use",
    }
  );

// update permission validation
export const permissionUpdateValidation = z
  .object({
    id: z
      .string({
        required_error: "Id is required",
        invalid_type_error: "Id must be a string",
      })
      .trim()
      .min(1, { message: "Id is required" })
      .refine(
        async (value) => {
          let permission = await permissionModel.get_permission_by_id(value);

          if (permission.data) return true;
          else return false;
        },
        {
          message: "Permission id not found",
        }
      ),

    name: z
      .string({
        required_error: "Permission name is required",
        invalid_type_error: "Permission name must be a string",
      })
      .trim()
      .min(1, { message: "Permission name is required" }),

    action: z
      .string({
        required_error: "Permission action is required",
        invalid_type_error: "Permission action must be a string",
      })
      .trim()
      .min(1, { message: "Permission action is required" }),
  })
  .refine(
    async (values) => {
      let permission = await permissionModel.get_permission_by_name_except_id(
        values
      );

      if (permission[0]) return false;
      else return true;
    },
    {
      message: "Permission name and action already in use",
    }
  );
