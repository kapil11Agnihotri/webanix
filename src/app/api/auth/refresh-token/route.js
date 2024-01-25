// import some custom modules like validation, models etc.
import * as userModel from "@/backend/models/userModel";
import { tokenValidation } from "@/backend/validation/userValidation";

// import next packages
import { NextResponse } from "next/server";

// import npm packages
import { SignJWT, jwtVerify } from "jose";

// ***************************************************************
// Refresh-Token : POST End point
// ***************************************************************
export async function POST(req) {
  let message = "Something went wrong",
    code = 500,
    data = null;

  try {
    const body = await req?.json();

    // check the validation of body -> stop execution if fails
    const valid = await tokenValidation.safeParseAsync(body);

    if (!valid.success) {
      (message = valid.error), (code = 422);
      return NextResponse.json({ message, code, data }, { status: code });
    }
    // *****************************************************

    // check the refresh token is expired or not
    let token = body.refreshToken;

    // pre-define the resposne content
    (message = "Token expired!"), (code = 401);

    // decode the refresh token
    const secret = new TextEncoder().encode(process.env.SECRECT_KEY);
    const { payload } = await jwtVerify(token, secret);

    // pre-define the resposne content
    (message = "Unable to fetch user"), (code = 404);

    // fetch the user from database
    const user = await userModel.get_user_by_id(payload.userId);

    if (user.code === 200) {
      //

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

      message = "User token refreshed";
      code = 2000;
      data = {
        userId: user.data.id,
        email: user.data.email,
        refreshToken: refreshToken,
        accessToken: accessToken,
      };

      //
    } //
    else {
      message = user.message;
      code = user.code;
      data = user.data;
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
