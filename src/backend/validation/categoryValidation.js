import z from "zod";
import * as commonQueryModel from "@/backend/models/commonQueryModel";

// create category validation
export const categoryCreateValidation = z.object({
  title: z
    .string({
      required_error: "title is required",
      invalid_type_error: "title must be a string",
    })
    .trim()
    .min(1, { message: "title should be at least 1 chars" })
    .refine(
      async (value) => {
        let data = await commonQueryModel.data_exist_by_field_except_deleted(
          "categories",
          "title",
          value
        );

        if (data.exist) return false;
        else return true;
      },
      {
        message: "Category title already exists",
      }
    ),

  slug: z
    .string({
      required_error: "slug is required",
      invalid_type_error: "slug must be a string",
    })
    .trim()
    .min(1, { message: "slug should be at least 1 chars" })
    .refine(
      async (value) => {
        let data = await commonQueryModel.data_exist_by_field_except_deleted(
          "categories",
          "slug",
          value
        );

        if (data.exist) return false;
        else return true;
      },
      {
        message: "Category slug already exists",
      }
    ),

  heading: z
    .string({
      required_error: "heading is required",
      invalid_type_error: "heading must be a string",
    })
    .trim()
    .min(1, { message: "heading should be at least 1 chars" }),

  content: z
    .string({
      required_error: "content is required",
      invalid_type_error: "content must be a string",
    })
    .trim()
    .min(1, { message: "content should be at least 1 chars" }),
});

// update category validation
export const categoryUpdateValidation = z
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
          let data = await commonQueryModel.data_exist_by_id(
            "categories",
            value
          );

          if (data.exist) return true;
          else return false;
        },
        {
          message: "Category id not found",
        }
      ),

    title: z
      .string({
        required_error: "title is required",
        invalid_type_error: "title must be a string",
      })
      .trim()
      .min(1, { message: "title should be at least 1 chars" }),

    slug: z
      .string({
        required_error: "slug is required",
        invalid_type_error: "slug must be a string",
      })
      .trim()
      .min(1, { message: "slug should be at least 1 chars" }),

    heading: z
      .string({
        required_error: "heading is required",
        invalid_type_error: "heading must be a string",
      })
      .trim()
      .min(1, { message: "heading should be at least 1 chars" }),

    content: z
      .string({
        required_error: "content is required",
        invalid_type_error: "content must be a string",
      })
      .trim()
      .min(1, { message: "content should be at least 1 chars" }),
  })
  .refine(
    async (values) => {
      let data =
        await commonQueryModel.data_exist_by_field_except_id_except_deleted(
          "categories",
          "title",
          values.title,
          values.id
        );

      if (data.exist) return false;
      else return true;
    },
    {
      message: "Category already exists",
    }
  )
  .refine(
    async (values) => {
      let data =
        await commonQueryModel.data_exist_by_field_except_id_except_deleted(
          "categories",
          "slug",
          values.slug,
          values.id
        );

      if (data.exist) return false;
      else return true;
    },
    {
      message: "Category slug already exists",
    }
  );
