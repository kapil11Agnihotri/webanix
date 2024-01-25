// import custum modules
import * as userModel from "@/backend/models/userModel";
import { passwordValidation } from "@/backend/validation/userValidation";

// import the next packages
import { NextResponse } from "next/server";

// ***************************************************************
// Update Password : PUT End point
// ***************************************************************
export async function PUT(req) {
  let message = "Something went wrong",
    code = 500;

  try {
    const body = await req?.json();
    const { password, email } = body;

    // check the validation of body -> stop execution if fails
    const valid = await passwordValidation.safeParseAsync(body);

    if (!valid.success) {
      (message = valid.error), (code = 422);
      return NextResponse.json({ message, code });
    }
    // *****************************************************

    const response = await userModel.update_password_of_user(email, password);

    message = response.message;
    code = response.code;
  } catch (err) {
    message = err;
  }

  // return the response to the client side
  return NextResponse.json(
    {
      message,
      code,
    },
    { status: code }
  );
}
