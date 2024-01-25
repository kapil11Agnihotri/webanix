// import some custom modules
import * as userModel from "@/backend/models/userModel";
import { userUpdateValidation } from "@/backend/validation/userValidation";

// import the next packages
import { NextResponse } from "next/server";

// ***************************************************************
// USERS by id: GET End point
// ***************************************************************
export async function GET(req, context) {

  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {

    const id = context?.params.id;

    response = await userModel.get_user_by_id(id);

  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}

// ***************************************************************
// USERS by id : PUT End point
// ***************************************************************
export async function PUT(req, context) {

  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {

    const body = await req?.json();
    const id = context.params.id;
    body.id = id;

    // check the validation -> stop execution if fails**************
    const valid = await userUpdateValidation.safeParseAsync(body);

    if (!valid.success) {
      (response.message = valid.error), (response.code = 422);
      return NextResponse.json(response, { status: response.code });
    }
    // **************************************************************

    response = await userModel.update(id, body);

  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}

// ***************************************************************
// USERS by id: DELETE End point
// ***************************************************************
export async function DELETE(req, context) {

  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {

    const id = context?.params?.id;

    response = await userModel.delete_user(id);

  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
