// import some custom modules
import * as roleHasPermissionModel from "@/backend/models/roleHasPermissionModel";

// import the next packages
import { NextResponse } from "next/server";

// ***************************************************************
// Role Has Permissions : GET End point
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

    response = await roleHasPermissionModel.get_permisssions_by_role(id);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}

// ***************************************************************
// Role Has Permissions : DELETE End point
// ***************************************************************
export async function DELETE(req, context) {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {
    const id = context.params.id;
    response = await roleHasPermissionModel.delete_role_permission(id);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
