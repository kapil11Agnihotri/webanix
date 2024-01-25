// import some custom modules like validation, models etc.
import * as userModel from "@/backend/models/userModel";
import * as roleModel from "@/backend/models/roleModel";
import { registerValidation } from "@/backend/validation/userValidation";

// import next packages
import { NextResponse } from "next/server";

// import npm packages
import { SignJWT } from "jose";

// ***************************************************************
// Register : POST End point
// ***************************************************************
export async function POST(req) {
  let message = "Something went wrong",
    code = 500,
    data = [];

  try {
    const body = await req?.json();

    // check the validation of body -> stop execution if fails
    const valid = await registerValidation.safeParseAsync(body);

    if (!valid.success) {
      (message = valid.error), (code = 422);
      return NextResponse.json({ message, code, data }, { status: code });
    }
    // *****************************************************

    const role = await roleModel.get_role_by_name(body?.role);
    body.role_id = role?.data?.id;

    const response = await userModel.store(body);

    if (response.code === 201) {
      //

      // define secret
      const secret = new TextEncoder().encode(process.env.SECRECT_KEY);

      // define access token
      const accessToken = await new SignJWT({
        userId: response.data.userId,
        email: response.data.email,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setIssuer("urn:example:issuer")
        .setAudience("urn:example:audience")
        .setExpirationTime("1d")
        .sign(secret);

      // define refresh token
      const refreshToken = await new SignJWT({
        userId: response.data.userId,
        email: response.data.email,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setIssuer("urn:example:issuer")
        .setAudience("urn:example:audience")
        .setExpirationTime("30d")
        .sign(secret);

      message = "User is registered successfully!";
      code = 201;
      data = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: response.data.userId,
        username: body.name,
        email: body.email,
        role_id: body.role_id,
        role: body.role,
      };
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
