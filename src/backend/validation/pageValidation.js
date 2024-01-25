import z from "zod";
import * as commonQueryModel from "@/backend/models/commonQueryModel";

// page create validataion code define here
export const pageCreateValidation = z.object({
  slug: z
    .string({
      required_error: "Slug is required",
      invalid_type_error: "Slug must be a string",
    })
    .trim()
    .min(1, { message: "Slug is required" })
    .refine(
      async (value) => {
        let page = await commonQueryModel.data_exist_by_field_except_deleted(
          "pages",
          "slug",
          value
        );

        if (page.exist) return false;
        return true;
      },
      {
        message: "Slug already exists",
      }
    ),

  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .trim()
    .min(1, { message: "Name is required" })
    .refine(
      async (value) => {
        let page = await commonQueryModel.data_exist_by_field_except_deleted(
          "pages",
          "name",
          value
        );

        if (page.exist) return false;
        return true;
      },
      {
        message: "Name already exists",
      }
    ),

  template_type: z
    .string({
      required_error: "template_type is required",
      invalid_type_error: "template_type must be a string",
    })
    .trim()
    .min(1, { message: "template_type is required" }),

  page_json: z
    .string({
      required_error: "page_json is required",
      invalid_type_error: "page_json must be a string",
    })
    .trim()
    .min(1, { message: "page_json is required" })

});

// page update validataion code define here
export const pageUpdateValidation = z
  .object({
    id: z
      .string({
        required_error: "id is required",
        invalid_type_error: "id must be a string",
      })
      .trim()
      .min(1, { message: "id is required" })
      .refine(
        async (value) => {
          let page = await commonQueryModel.data_exist_by_id("pages", value);

          if (page.exist) return true;
          return false;
        },
        {
          message: "Page not found",
        }
      ),

    slug: z
      .string({
        required_error: "Slug is required",
        invalid_type_error: "Slug must be a string",
      })
      .trim()
      .min(1, { message: "Slug is required" }),

    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .trim()
      .min(1, { message: "Name is required" }),

    template_type: z
      .string({
        required_error: "template_type is required",
        invalid_type_error: "template_type must be a string",
      })
      .trim()
      .min(1, { message: "template_type is required" }),

    page_json: z
      .string({
        required_error: "page_json is required",
        invalid_type_error: "page_json must be a string",
      })
      .trim()
      .min(1, { message: "page_json is required" })

  })
  .refine(
    async (values) => {
      let page =
        await commonQueryModel.data_exist_by_field_except_id_except_deleted(
          "pages",
          "name",
          values.name,
          values.id
        );

      if (page.exist) return false;
      return true;
    },
    {
      message: "Name already exits",
    }
  )
  .refine(
    async (values) => {
      let page =
        await commonQueryModel.data_exist_by_field_except_id_except_deleted(
          "pages",
          "slug",
          values.slug,
          values.id
        );

      if (page.exist) return false;
      return true;
    },
    {
      message: "Slug already exits",
    }
  );

// page delete validataion code define here
export const pageDeleteValidation = z.object({
  id: z
    .string({
      required_error: "id is required",
      invalid_type_error: "id must be a string",
    })
    .trim()
    .min(1, { message: "id is required" })
    .refine(
      async (value) => {
        let page = await commonQueryModel.data_exist_by_id("pages", value);

        if (page.exist) return true;
        return false;
      },
      {
        message: "Id not found",
      }
    ),
});
