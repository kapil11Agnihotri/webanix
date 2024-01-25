import z from "zod";

// register validation body
export const contactCreateValidation = z.object({
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
  messageText: z
    .string({
      required_error: "Message is required",
      invalid_type_error: "Message must be a string",
    })
    .trim()
    .min(5, { message: "Message should be at least 5 chars" })
    .max(300, { message: "Message should be at most 300 chars" }),
});
