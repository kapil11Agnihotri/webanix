// import some custom modules
import * as userModel from "@/backend/models/userModel";
import { userCreateValidation } from "@/backend/validation/userValidation";

// import the next packages
import { NextResponse } from "next/server";

// ***************************************************************
// USERS: GET End point
// ***************************************************************
export async function GET(req) {

  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {

    response = await userModel.get_users();

  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}

// ***************************************************************
// USERS : POST End point
// ***************************************************************
export async function POST(req) {

  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {

    const body = await req?.json();

    // check the validation -> stop execution if fails**************
    const valid = await userCreateValidation.safeParseAsync(body);

    if (!valid.success) {
      (response.message = valid.error), (response.code = 422);
      return NextResponse.json(response, { status: response.code });
    }
    // **************************************************************

    response = await userModel.store(body);

  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
