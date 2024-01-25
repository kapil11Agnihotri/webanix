// import some custom modules
import { otpHTML } from "@/backend/helpers/html_body_otp";
import * as userModel from "@/backend/models/userModel";
import { transporter } from "@/backend/helpers/sendEmail";
import { emailValidation } from "@/backend/validation/userValidation";

// import the next packages
import { NextResponse } from "next/server";

// ***************************************************************
//  Generate OTP : PUT End point
// ***************************************************************
export async function PUT(req) {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    const body = await req?.json();
    const { email } = body;

    // check the validation of body -> stop execution if fails
    const valid = await emailValidation.safeParseAsync(body);

    if (!valid.success) {
      (message = valid.error), (code = 422);
      return NextResponse.json({ message, code, data }, { status: code });
    }
    // *****************************************************

    (message = "This email not exist!"), (code = 422);

    // fetch the user's detail from database
    const user = await userModel.get_user_by_email(email);

    if (user.code === 200) {
      //
      (message = "OTP is unable to generate"), (code = 422), (data = null);

      let otp = Math.ceil(Math.random() * 1000000);
      let res = await userModel.update_otp(user.data.email, otp);

      if (res.code == 201) {
        // ************ Code : send email to user ************
        const info = await transporter.sendMail({
          from: process.env.NEXT_PUBLIC_MY_EMAIL,
          to: user.data.email,
          subject: "Account Verification ",
          html: otpHTML(otp),
        });
        // ***************************************************

        message = "otp generate successfully";
        code = 200;
        data = { status: info.messageId, otp: otp };
      }
    }
  } catch (err) {
    message = err;
  }

  // return the response to the client side
  return NextResponse.json({
    message,
    code,
    data,
  });
}
