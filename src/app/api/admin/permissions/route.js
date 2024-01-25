// import some custom modules
import * as permissionModel from "@/backend/models/permissionModel";
import { permissionCreateValidation } from "@/backend/validation/permissionValidation";

// import the next packages
import { NextResponse } from "next/server";

// Permissions : GET End point
export async function GET(req) {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {
    response = await permissionModel.get_permissions();
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}

// Permissions : POST End point
export async function POST(req) {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {
    const body = await req?.json();

    const valid = await permissionCreateValidation.safeParseAsync(body);

    // check the validation 
    if (!valid.success) {
      (response.message = valid.error), (response.code = 422);
      return NextResponse.json(response, { status: response.code });
    }

    response = await permissionModel.store(body);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
