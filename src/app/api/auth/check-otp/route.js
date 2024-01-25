// import some custom modules
import { otpValidation } from "@/backend/validation/userValidation.js";
import * as commonQueryModel from "@/backend/models/commonQueryModel";

// import the next package
import { NextResponse } from "next/server";

// ***************************************************************
//  Verify OTP : POST End point
// ***************************************************************
export async function POST(req) {
  let message = "Something went wrong",
    code = 500;

  try {
    const body = await req?.json();
    const { email, otp } = body;

    // check the validation of body -> stop execution if fails
    const valid = await otpValidation.safeParseAsync(body);

    if (!valid.success) {
      (message = valid.error), (code = 422);
      return NextResponse.json({ message, code, data }, { status: code });
    }
    // *****************************************************

    (message = "OTP is invalid!"), (code = 401);

    // verify the otp from database
    const data = await commonQueryModel.get_specific_data_by_field(
      "otp",
      "users",
      "email",
      email
    );

    if (data[0].otp === otp) {
      (message = "OTP is valid!"), (code = 202);
    }
  } catch (err) {
    message = err;
  }

  // return the response to the client side
  return NextResponse.json({
    message,
    code,
  });
}
