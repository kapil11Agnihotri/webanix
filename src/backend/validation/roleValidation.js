import z from "zod";
import * as commonQueryModel from "@/backend/models/commonQueryModel";

// role create validation
export const roleCreateValidation = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .trim()
    .min(1, { message: "Name is required" })
    .refine(
      async (value) => {
        let role = await commonQueryModel.data_exist_by_field_except_deleted(
          "roles",
          "name",
          value
        );

        if (role.exist) return false;
        else return true;
      },
      {
        message: "Role name already in use",
      }
    ),
});

// role update validation
export const roleUpdateValidation = z
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
          let role = await commonQueryModel.data_exist_by_id("roles", value);

          if (role.exist) return true;
          else return false;
        },
        {
          message: "Role id not found",
        }
      ),

    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .trim()
      .min(1, { message: "Name is required" }),
  })
  .refine(
    async (values) => {
      let role = await commonQueryModel.data_exist_by_field_except_id_except_deleted(
        "roles",
        "name",
        values.name,
        values.id
      );

      if (role.exist) return false;
      else return true;
    },
    {
      message: "Role name already in use",
    }
  );
