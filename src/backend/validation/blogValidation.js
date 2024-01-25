import z from "zod";
import * as commonQueryModel from "@/backend/models/commonQueryModel";

// create blog validation
export const blogCreateValidation = z.object({
  slug: z
    .string({
      required_error: "slug is required",
      invalid_type_error: "slug must be a string",
    })
    .trim()
    .min(1, { message: "slug should be at least 1 chars" })
    .refine(
      async (value) => {
        let blog = await commonQueryModel.data_exist_by_field_except_deleted(
          "blogs",
          "slug",
          value
        );

        if (blog.exist) return false;
        else return true;
      },
      {
        message: "Title already exists",
      }
    ),

  title: z
    .string({
      required_error: "title is required",
      invalid_type_error: "title must be a string",
    })
    .trim()
    .min(1, { message: "title should be at least 1 chars" })
    .refine(
      async (value) => {
        let blog = await commonQueryModel.data_exist_by_field_except_deleted(
          "blogs",
          "title",
          value
        );

        if (blog.exist) return false;
        else return true;
      },
      {
        message: "Title already exists",
      }
    ),

  description: z
    .string({
      required_error: "description is required",
      invalid_type_error: "description must be a string",
    })
    .trim()
    .min(1, { message: "description should be at least 1 chars" }),

  short_description: z
    .string({
      required_error: "short_description is required",
      invalid_type_error: "short_description must be a string",
    })
    .trim()
    .min(1, { message: "short_description should be at least 1 chars" }),

  blog_tags: z
    .string({
      required_error: "blog_tags is required",
      invalid_type_error: "blog_tags must be a string",
    })
    .trim()
    .min(1, { message: "blog_tags should be at least 1 chars" }),

  blog_type: z
    .string({
      required_error: "blog_type is required",
      invalid_type_error: "blog_type must be a string",
    })
    .trim()
    .min(1, { message: "blog_type should be at least 1 chars" })
    .refine(
      async (value) => {
        let blog = await commonQueryModel.data_exist_by_field_except_deleted(
          "blog_types",
          "id",
          value
        );

        if (blog.exist) return true;
        else return false;
      },
      {
        message: "Blog type id is not exits",
      }
    ),
});

// update blog validation
export const blogUpdateValidation = z
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
          let blog = await commonQueryModel.data_exist_by_id("blogs", value);

          if (blog.exist) return true;
          else return false;
        },
        {
          message: "blog id not found",
        }
      ),
    slug: z
      .string({
        required_error: "slug is required",
        invalid_type_error: "slug must be a string",
      })
      .trim()
      .min(1, { message: "slug should be at least 1 chars" }),

    title: z
      .string({
        required_error: "title is required",
        invalid_type_error: "title must be a string",
      })
      .trim()
      .min(1, { message: "title should be at least 1 chars" }),

    description: z
      .string({
        required_error: "description is required",
        invalid_type_error: "description must be a string",
      })
      .trim()
      .min(1, { message: "description should be at least 1 chars" }),

    short_description: z
      .string({
        required_error: "short_description is required",
        invalid_type_error: "short_description must be a string",
      })
      .trim()
      .min(1, { message: "short_description should be at least 1 chars" }),

    blog_tags: z
      .string({
        required_error: "blog_tags is required",
        invalid_type_error: "blog_tags must be a string",
      })
      .trim()
      .min(1, { message: "blog_tags should be at least 1 chars" }),

    blog_type: z
      .string({
        required_error: "blog_type is required",
        invalid_type_error: "blog_type must be a string",
      })
      .trim()
      .min(1, { message: "blog_type should be at least 1 chars" })
      .refine(
        async (value) => {
          let blog = await commonQueryModel.data_exist_by_field_except_deleted(
            "blog_types",
            "id",
            value
          );

          if (blog.exist) return true;
          else return false;
        },
        {
          message: "Blog type id is not exits",
        }
      ),
  })
  .refine(
    async (values) => {
      let blog =
        await commonQueryModel.data_exist_by_field_except_id_except_deleted(
          "blogs",
          "title",
          values.title,
          values.id
        );

      if (blog.exist) return false;
      else return true;
    },
    {
      message: "Title already exists",
    }
  )
  .refine(
    async (values) => {
      let blog =
        await commonQueryModel.data_exist_by_field_except_id_except_deleted(
          "blogs",
          "slug",
          values.slug,
          values.id
        );

      if (blog.exist) return false;
      else return true;
    },
    {
      message: "Slug already exists",
    }
  );
