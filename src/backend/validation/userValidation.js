import z from "zod";
import * as commonQueryModel from "@/backend/models/commonQueryModel";

// register validation body
export const registerValidation = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .trim()
    .min(4, { message: "Name should be at least 4 chars" })
    .max(255, { message: "Name should be at most 255 chars" }),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .trim()
    .email({ message: "Invalid email address" })
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
      message: "Email must be valid email",
    })
    .refine(
      async (value) => {
        let user = await commonQueryModel.data_exist_by_field_except_deleted(
          "users",
          "email",
          value
        );

        if (user.exist) return false;
        return true;
      },
      {
        message: "Email already exists.",
      }
    ),

  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(8, { message: "Password should be at least 8 chars" })
    .regex(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      {
        message:
          "Password must contain at least 8 characters, one uppercase, one number and one special case character",
      }
    ),
});

// Login validation body
export const loginValidation = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .trim()
    .email({ message: "Invalid email address" })
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
      message: "Email must be valid email",
    })
    .refine(
      async (value) => {
        let user = await commonQueryModel.get_data_by_field(
          "users",
          "email",
          value
        );

        // if email not exist then it return 0 otherwise return 1
        if (user[0]) return true;
        else return false;
      },
      {
        message: "Email not exist!",
      }
    ),

  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(8, { message: "Password should be at least 8 chars" }),
});

// Login validation body
export const userCreateValidation = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .trim()
    .min(4, { message: "Name should be at least 4 chars" })
    .max(255, { message: "Name should be at most 255 chars" }),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .trim()
    .email({ message: "Invalid email address" })
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
      message: "Email must be valid email",
    })
    .refine(
      async (value) => {
        let user = await commonQueryModel.data_exist_by_field_except_deleted(
          "users",
          "email",
          value
        );

        if (user.exist) return false;
        return true;
      },
      {
        message: "Email already exists.",
      }
    ),

  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(8, { message: "Password should be at least 8 chars" })
    .regex(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      {
        message:
          "Password must contain at least 8 characters, one uppercase, one number and one special case character",
      }
    ),

  role_id: z
    .string({
      required_error: "Role id is required",
      invalid_type_error: "Role id must be a string",
    })
    .trim()
    .min(1, { message: "Role id is required" })
    .refine(async (value) => {

      let role = await commonQueryModel.data_exist_by_id("roles", value);

      if (role.exist) return true;
      else return false;

    }, {
      message: "Role name not exist"
    }),
});

// Login validation body
export const userUpdateValidation = z
  .object({
    id: z
      .string({
        required_error: "Id is required",
        invalid_type_error: "Id must be a string",
      })
      .trim()
      .min(1, { message: "Id should be at least 1 chars" })
      .refine(async (value) => {

        let user = await commonQueryModel.data_exist_by_id("users", value);

        if (user.exist) return true;
        else return false;

      }, {
        message: "User id not found"
      }),

    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .trim()
      .min(4, { message: "Name should be at least 4 chars" })
      .max(255, { message: "Name should be at most 255 chars" }),

    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .trim()
      .email({ message: "Invalid email address" })
      .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
        message: "Email must be valid email",
      }),

    password: z
      .string({ required_error: "Password is required" })
      .trim()
      .min(8, { message: "Password should be at least 8 chars" })
      .regex(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        {
          message:
            "Password must contain at least 8 characters, one uppercase, one number and one special case character",
        }
      )
      .optional(),

    role_id: z
      .string({
        required_error: "Role id is required",
        invalid_type_error: "Role id must be a string",
      })
      .trim()
      .min(1, { message: "Role id is required" })
      .refine(async (value) => {

        let role = await commonQueryModel.data_exist_by_id("roles", value);

        if (role.exist) return true;
        else return false;

      }, {
        message: "Role name not exist"
      }),
  })
  .refine(
    async (values) => {

      let user = await commonQueryModel.data_exist_by_field_except_id_except_deleted("users", "email", values.email, values.id);

      if (user.exist) return false;
      else return true;
    },
    {
      message: "Email already exists.",
    }
  );

// refresh token validation body
export const tokenValidation = z.object({
  refreshToken: z
    .string({
      required_error: "token is required",
      invalid_type_error: "token must be a string",
    })
    .min(5, { message: "token is too short" }),
});

// email validation body
export const emailValidation = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .trim()
    .email({ message: "Invalid email address" }),
});

// email and otp validation body
export const otpValidation = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .trim()
    .email({ message: "Invalid email address" }),
  otp: z
    .string()
    .trim()
    .length(5, { message: "Must be exactly 5 digits long" }),
});

// update password validation body
export const passwordValidation = z
  .object({
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .trim()
      .email({ message: "Invalid email address" }),

    password: z
      .string({ required_error: "Password is required" })
      .trim()
      .min(8, { message: "Password should be at least 8 chars" })
      .regex(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        {
          message:
            "Password must contain at least 8 characters, one uppercase, one number and one special case character",
        }
      ),

    confirm_password: z
      .string({ required_error: "Confir_password is required" })
      .trim(),
  })
  .refine((values) => values.password === values.confirm_password, {
    message: "Password and confirm_password should be equal",
  });
