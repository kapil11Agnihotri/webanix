// import npm packages
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

// import custom modules like models, validation etc
import * as userModel from "@/backend/models/userModel";
import { loginValidation } from "@/backend/validation/userValidation";

// import the next packages
import { NextResponse } from "next/server";

// ***************************************************************
// Login : POST End point
// ***************************************************************
export async function POST(req) {
  // Pre-define the resposne constent
  let message = "Something went wrong!",
    code = 500,
    data = [];

  try {
    // parse the upcoming req into json;
    const body = await req?.json();
    const { email, password } = body;

    // check the validation of body -> stop execution if fails
    const valid = await loginValidation.safeParseAsync(body);

    if (!valid.success) {
      (message = valid.error), (code = 422);
      return NextResponse.json({ message, code, data }, { status: code });
    }
    // *****************************************************

    (message = "Bad Credentials!"), (code = 401), (data = []);

    // when it passes the validatioin check
    const user = await userModel.get_user_by_email(email);
    // if user is exist
    if (user.data) {
      //

      const verifyPassword = await bcrypt.compare(password, user.data.password);

      if (email == user.data.email && verifyPassword) {
        //

        const secret = new TextEncoder().encode(process.env.SECRECT_KEY);

        // define access token
        const accessToken = await new SignJWT({
          userId: user.data.id,
          email: user.data.email,
        })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setIssuer("urn:example:issuer")
          .setAudience("urn:example:audience")
          .setExpirationTime("1d")
          .sign(secret);

        // define refresh token
        const refreshToken = await new SignJWT({
          userId: user.data.id,
          email: user.data.email,
        })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setIssuer("urn:example:issuer")
          .setAudience("urn:example:audience")
          .setExpirationTime("30d")
          .sign(secret);

        message = "Successfully LogIn";
        code = 200;
        data = {
          accessToken: accessToken,
          refreshToken: refreshToken,
          userId: user.data.id,
          username: user.data.name,
          email: user.data.email,
          role_id: user.data.role_id,
          role: user.data.role_name,
        };

        //
      }
    }
  } catch (err) {
    message = err;
  }

  return NextResponse.json({ message, code, data }, { status: code });
}
