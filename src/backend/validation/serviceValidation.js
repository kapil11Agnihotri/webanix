import z from "zod";
import * as commonQueryModel from "@/backend/models/commonQueryModel";

// create service validation
export const serviceCreateValidation = z.object({
  slug: z
    .string({
      required_error: "slug is required",
      invalid_type_error: "slug must be a string",
    })
    .trim()
    .min(1, { message: "slug should be at least 1 chars" })
    .refine(
      async (value) => {
        let service = await commonQueryModel.data_exist_by_field_except_deleted(
          "services",
          "slug",
          value
        );

        if (service.exist) return false;
        else return true;
      },
      {
        message: "Slug already exists",
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
        let service = await commonQueryModel.data_exist_by_field_except_deleted(
          "services",
          "title",
          value
        );

        if (service.exist) return false;
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

  featured_for: z
    .string({
      required_error: "featured_for is required",
      invalid_type_error: "featured_for must be a string",
    })
    .trim()
    .min(1, { message: "featured_for should be at least 1 chars" }),

  category: z
    .string({
      required_error: "category is required",
      invalid_type_error: "category must be a string",
    })
    .trim()
    .min(1, { message: "category should be at least 1 chars" })
    .refine(
      async (value) => {
        let category =
          await commonQueryModel.data_exist_by_field_except_deleted(
            "categories",
            "id",
            value
          );

        if (category.exist) return true;
        else return false;
      },
      {
        message: "Catergory is not exits",
      }
    ),
});

// update service validation
export const serviceUpdateValidation = z
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
          let service = await commonQueryModel.data_exist_by_id(
            "services",
            value
          );

          if (service.exist) return true;
          else return false;
        },
        {
          message: "Service id not found",
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

    featured_for: z
      .string({
        required_error: "featured_for is required",
        invalid_type_error: "featured_for must be a string",
      })
      .trim()
      .min(1, { message: "featured_for should be at least 1 chars" }),

    category: z
      .string({
        required_error: "category is required",
        invalid_type_error: "category must be a string",
      })
      .trim()
      .min(1, { message: "category should be at least 1 chars" })
      .refine(
        async (value) => {
          let category =
            await commonQueryModel.data_exist_by_field_except_deleted(
              "categories",
              "id",
              value
            );

          if (category.exist) return true;
          else return false;
        },
        {
          message: "Catergory is not exits",
        }
      ),
  })
  .refine(
    async (values) => {
      // custom validation

      let service =
        await commonQueryModel.data_exist_by_field_except_id_except_deleted(
          "services",
          "title",
          values.title,
          values.id
        );

      if (service.exist) return false;
      else return true;
    },
    {
      message: "Blog title already exists.",
    }
  )
  .refine(
    async (values) => {
      // custom validation

      let service =
        await commonQueryModel.data_exist_by_field_except_id_except_deleted(
          "services",
          "slug",
          values.slug,
          values.id
        );

      if (service.exist) return false;
      else return true;
    },
    {
      message: "Blog slug already exists.",
    }
  );
