// import some custom modules
import * as roleModel from "@/backend/models/roleModel.js";
import { roleUpdateValidation } from "@/backend/validation/roleValidation";

// import the next packages
import { NextResponse } from "next/server";

// ***************************************************************
// Roles : GET End point
// ***************************************************************
export async function GET(req, context) {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {
    const id = context.params.id;

    response = await roleModel.get_role_by_id(id);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}

// ***************************************************************
// Roles : PUT End point
// ***************************************************************
export async function PUT(req, context) {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {
    const id = context.params.id;
    let body = await req?.json();
    body.id = id;

    // check the validation -> stop execution if fails**************
    const valid = await roleUpdateValidation.safeParseAsync(body);

    if (!valid.success) {
      (response.message = valid.error), (response.code = 422);
      return NextResponse.json(response, { status: response.code });
    }
    // **************************************************************

    response = await roleModel.update(id, body.name);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
