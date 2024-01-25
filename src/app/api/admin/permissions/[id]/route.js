import * as permissionModel from "@/backend/models/permissionModel";
import { permissionUpdateValidation } from "@/backend/validation/permissionValidation";

import { NextResponse } from "next/server";

// Permissions Id : GET End point
export async function GET(req, context) {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {
    const id = context.params.id;

    response = await permissionModel.get_permission_by_id(id);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}

// Permissions Id : PUT End point
export async function PUT(req, context) {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {
    let body = await req?.json();
    const id = context.params.id;

    // body should contain id, name, action fields
    body.id = id;

    const valid = await permissionUpdateValidation.safeParseAsync(body);

    // check the validation 
    if (!valid.success) {
      (response.message = valid.error), (response.code = 422);
      return NextResponse.json(response, { status: response.code });
    }

    response = await permissionModel.update(id, body);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
