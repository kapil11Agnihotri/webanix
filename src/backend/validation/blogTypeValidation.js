import z from "zod";
import * as commonQueryModel from "@/backend/models/commonQueryModel";

// create blogType validation
export const blogTypeCreateValidation = z.object({
  name: z
    .string({
      required_error: "name is required",
      invalid_type_error: "name must be a string",
    })
    .trim()
    .min(1, { message: "name should be at least 1 chars" })
    .refine(
      async (value) => {
        let blogType =
          await commonQueryModel.data_exist_by_field_except_deleted(
            "blog_types",
            "name",
            value
          );

        if (blogType.exist) return false;
        else return true;
      },
      {
        message: "Blog type name already exists",
      }
    ),
});

// update blogs validation
export const blogTypeUpdateValidation = z
  .object({
    id: z
      .string({
        required_error: "id is required",
        invalid_type_error: "id must be a string",
      })
      .trim()
      .min(1, { message: "id should be at least 1 chars" })
      .refine(
        async (value) => {
          let blogType = await commonQueryModel.data_exist_by_id(
            "blog_types",
            value
          );

          if (blogType.exist) return true;
          else return false;
        },
        {
          message: "Blog type id not found",
        }
      ),
    name: z
      .string({
        required_error: "name is required",
        invalid_type_error: "name must be a string",
      })
      .trim()
      .min(1, { message: "name should be at least 1 chars" }),
  })
  .refine(
    async (values) => {
      // custom validation

      let blogType =
        await commonQueryModel.data_exist_by_field_except_id_except_deleted(
          "blog_types",
          "name",
          values.name,
          values.id
        );

      if (blogType.exist) return false;
      else return true;
    },
    {
      message: "Blog title already exists.",
    }
  );
