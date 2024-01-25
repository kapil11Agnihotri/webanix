// import some custom modules
import * as roleModel from "@/backend/models/roleModel.js";
import { roleCreateValidation } from "@/backend/validation/roleValidation";

// import the next packages
import { NextResponse } from "next/server";

// ***************************************************************
// Roles : GET End point
// ***************************************************************
export async function GET(req) {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {
    response = await roleModel.get_roles(req);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}

// ***************************************************************
// Roles : POST End point
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
    const valid = await roleCreateValidation.safeParseAsync(body);

    if (!valid.success) {
      (response.message = valid.error), (response.code = 422);
      return NextResponse.json(response, { status: response.code });
    }
    // **************************************************************

    response = await roleModel.store(body.name);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
