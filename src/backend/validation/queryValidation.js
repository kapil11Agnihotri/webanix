import z from "zod";

// query create validation body
export const queryCreateValidation = z.object({
  name: z
    .string({
      required_error: "name is required",
      invalid_type_error: "name must be a string",
    })
    .trim()
    .min(1, { message: "name is required" }),

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

  mobile: z
    .string({
      required_error: "mobile is required",
      invalid_type_error: "mobile must be a string",
    })
    .trim()
    .min(10, { message: "mobile is should be 10 digits" }),
});
